const express = require('express');
const router = express.Router();
const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceMetrics,
} = require('../controllers/device.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

// All routes require login
router.use(protect);

router.get('/', getAllDevices);
router.get('/:id', getDeviceById);
router.get('/:id/metrics', getDeviceMetrics);
router.post('/', allowRoles('admin', 'it_staff'), createDevice);
router.patch('/:id', allowRoles('admin', 'it_staff'), updateDevice);
router.delete('/:id', allowRoles('admin'), deleteDevice);

module.exports = router;