const Device = require('../models/Device');
const Alert = require('../models/Alert');
const Ticket = require('../models/Ticket');
const Metric = require('../models/Metric');

// GET /api/analytics/summary
const getSummary = async (req, res) => {
  try {
    const totalDevices = await Device.countDocuments();
    const onlineDevices = await Device.countDocuments({ status: 'online' });
    const offlineDevices = await Device.countDocuments({ status: 'offline' });
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const unresolvedAlerts = await Alert.countDocuments({ acknowledged: false });

    res.json({
      totalDevices,
      onlineDevices,
      offlineDevices,
      uptimePercent: totalDevices
        ? Math.round((onlineDevices / totalDevices) * 100)
        : 0,
      openTickets,
      unresolvedAlerts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/analytics/alerts-by-day
const getAlertsByDay = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const data = await Alert.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/analytics/ticket-stats
const getTicketStats = async (req, res) => {
  try {
    const data = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/analytics/device-uptime
const getDeviceUptime = async (req, res) => {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const devices = await Device.find();

    const uptimeData = await Promise.all(
      devices.map(async (device) => {
        const metrics = await Metric.countDocuments({
          device: device._id,
          createdAt: { $gte: last24Hours },
        });

        const onlineMetrics = await Metric.countDocuments({
          device: device._id,
          status: 'online',
          createdAt: { $gte: last24Hours },
        });

        return {
          deviceName: device.name,
          ipAddress: device.ipAddress,
          uptimePercent: metrics
            ? Math.round((onlineMetrics / metrics) * 100)
            : 0,
        };
      })
    );

    res.json({ data: uptimeData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSummary, getAlertsByDay, getTicketStats, getDeviceUptime };