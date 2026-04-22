const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required'],
    unique: true,
    trim: true,
  },
  macAddress: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  type: {
    type: String,
    enum: ['router', 'switch', 'access_point', 'server', 'other'],
    default: 'other',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  zone: {
    type: String,
    default: 'general',
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'degraded'],
    default: 'offline',
  },
  lastSeen: {
    type: Date,
    default: null,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);