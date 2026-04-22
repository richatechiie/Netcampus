const { Queue, Worker } = require('bullmq');
const redis = require('../config/redis');
const emailService = require('../services/email.service');
const Alert = require('../models/Alert');

const alertQueue = new Queue('alerts', {
  connection: redis,
});

const alertWorker = new Worker('alerts', async (job) => {
  const { deviceName, deviceIp, type, severity, alertId } = job.data;

  console.log(`Processing alert job: ${type} for ${deviceName}`);

  // Send email notification
  await emailService.sendAlertEmail({
    deviceName,
    deviceIp,
    type,
    severity,
  });

  console.log(`Alert email sent for ${deviceName}`);
}, {
  connection: redis,
  limiter: {
    max: 10,
    duration: 60000, // max 10 emails per minute
  },
});

alertWorker.on('completed', (job) => {
  console.log(`Alert job ${job.id} completed`);
});

alertWorker.on('failed', (job, err) => {
  console.error(`Alert job ${job.id} failed: ${err.message}`);
});

module.exports = { alertQueue };