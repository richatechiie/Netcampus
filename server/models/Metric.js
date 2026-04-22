const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  latencyMs: {
    type: Number,
    default: null,
  },
  packetLoss: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'degraded'],
    required: true,
  },
}, { timestamps: true });

// Auto delete metrics older than 30 days
metricSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Metric', metricSchema);