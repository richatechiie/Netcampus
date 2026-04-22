const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(protect);
router.use(allowRoles('admin'));

router.get('/', getAllUsers);
router.patch('/:id', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;