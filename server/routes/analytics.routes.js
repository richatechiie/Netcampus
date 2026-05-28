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

// Summary visible to all roles — students see it on dashboard
router.get('/summary', getSummary);

// Detailed analytics — admin and it_staff only
router.get('/alerts-by-day', allowRoles('admin', 'it_staff'), getAlertsByDay);
router.get('/ticket-stats', allowRoles('admin', 'it_staff'), getTicketStats);
router.get('/device-uptime', allowRoles('admin', 'it_staff'), getDeviceUptime);

module.exports = router;