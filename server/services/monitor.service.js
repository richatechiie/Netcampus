const cron = require('node-cron');
const ping = require('ping');
const Device = require('../models/Device');
const Alert = require('../models/Alert');
const Metric = require('../models/Metric');
const redis = require('../config/redis');
const { alertQueue } = require('../jobs/alert.job');

const CACHE_KEY = 'devices:all';

const checkDevice = async (device, io) => {
  try {
    const result = await ping.promise.probe(device.ipAddress, {
      timeout: 5,
      extra: ['-c', '1'],
    });

    const isAlive = result.alive;
    const latencyMs = isAlive ? parseFloat(result.time) : null;
    const newStatus = isAlive ? 'online' : 'offline';
    const prevStatus = device.status;

    // Save metric record
    await Metric.create({
      device: device._id,
      latencyMs,
      packetLoss: isAlive ? 0 : 100,
      status: newStatus,
    });

    // Only act if status changed
    if (newStatus !== prevStatus) {
      // Update device in DB
      await Device.findByIdAndUpdate(device._id, {
        status: newStatus,
        lastSeen: isAlive ? new Date() : device.lastSeen,
      });

      // Invalidate Redis cache
      await redis.del(CACHE_KEY);

      const alertType = isAlive ? 'device_up' : 'device_down';
      const severity = isAlive ? 'low' : 'critical';
      const message = isAlive
        ? `${device.name} is back online`
        : `${device.name} is offline`;

      // Save alert to DB
      const alert = await Alert.create({
        device: device._id,
        type: alertType,
        message,
        severity,
      });

      // Emit real-time socket event
      io.emit('alert', {
        alertId: alert._id,
        deviceId: device._id,
        deviceName: device.name,
        deviceIp: device.ipAddress,
        type: alertType,
        message,
        severity,
        timestamp: new Date(),
      });

      io.emit('device_status_change', {
        deviceId: device._id,
        newStatus,
        prevStatus,
      });

      // Add email job to queue
      await alertQueue.add('send_alert_email', {
        deviceName: device.name,
        deviceIp: device.ipAddress,
        type: alertType,
        severity,
        alertId: alert._id,
      });

      console.log(`Status change: ${device.name} ${prevStatus} → ${newStatus}`);
    } else if (isAlive) {
      // Update lastSeen even if status didn't change
      await Device.findByIdAndUpdate(device._id, {
        lastSeen: new Date(),
      });
    }
  } catch (error) {
    console.error(`Error checking device ${device.name}: ${error.message}`);
  }
};

const startMonitoring = (io) => {
  console.log('Network monitoring engine started');

  // Run every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const devices = await Device.find();
      if (devices.length === 0) return;

      console.log(`Checking ${devices.length} device(s)...`);

      // Check all devices in parallel
      await Promise.all(devices.map((device) => checkDevice(device, io)));
    } catch (error) {
      console.error(`Monitoring error: ${error.message}`);
    }
  });
};

module.exports = { startMonitoring };