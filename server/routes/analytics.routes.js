const express = require('express');
const router = express.Router();
const {
  getSummary,
  getAlertsByDay,
  getTicketStats,
  getDeviceUptime,
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(protect);
router.use(allowRoles('admin', 'it_staff'));

router.get('/summary', getSummary);
router.get('/alerts-by-day', getAlertsByDay);
router.get('/ticket-stats', getTicketStats);
router.get('/device-uptime', getDeviceUptime);

module.exports = router;