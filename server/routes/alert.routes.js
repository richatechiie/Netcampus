const express = require('express');
const router = express.Router();
const {
  getAllAlerts,
  acknowledgeAlert,
  deleteAlert,
} = require('../controllers/alert.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(protect);

router.get('/', allowRoles('admin', 'it_staff'), getAllAlerts);
router.patch('/:id/acknowledge', allowRoles('admin', 'it_staff'), acknowledgeAlert);
router.delete('/:id', allowRoles('admin'), deleteAlert);

module.exports = router;