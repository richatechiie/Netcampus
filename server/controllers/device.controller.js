const Device = require('../models/Device');
const redis = require('../config/redis');

const CACHE_KEY = 'devices:all';
const CACHE_TTL = 60; // 60 seconds

// GET /api/devices
const getAllDevices = async (req, res) => {
  try {
    // Check Redis cache first
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return res.json({ source: 'cache', devices: JSON.parse(cached) });
    }

    const devices = await Device.find().populate('addedBy', 'name email');
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(devices));

    res.json({ source: 'db', devices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/devices/:id
const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/devices
const createDevice = async (req, res) => {
  try {
    const { name, ipAddress, macAddress, type, location, zone } = req.body;

    const existing = await Device.findOne({ ipAddress });
    if (existing) {
      return res.status(400).json({ error: 'Device with this IP already exists' });
    }

    const device = await Device.create({
      name,
      ipAddress,
      macAddress,
      type,
      location,
      zone,
      addedBy: req.user._id,
    });

    // Invalidate cache
    await redis.del(CACHE_KEY);

    res.status(201).json({ message: 'Device created successfully', device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/devices/:id
const updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Invalidate cache
    await redis.del(CACHE_KEY);

    res.json({ message: 'Device updated successfully', device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/devices/:id
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Invalidate cache
    await redis.del(CACHE_KEY);

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/devices/:id/metrics
const getDeviceMetrics = async (req, res) => {
  try {
    const Metric = require('../models/Metric');
    const metrics = await Metric.find({ device: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceMetrics,
};