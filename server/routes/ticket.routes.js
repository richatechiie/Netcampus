const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticket.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(protect);

router.get('/', getAllTickets);
router.post('/', createTicket);
router.patch('/:id', allowRoles('admin', 'it_staff'), updateTicket);
router.delete('/:id', allowRoles('admin'), deleteTicket);

module.exports = router;