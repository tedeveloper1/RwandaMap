const express = require('express');
const router = express.Router();  // Make sure it's express.Router()

const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Get all users (admin only)
router.get('/getusers', 
  userController.getAllUsers
);

// Update user role (admin only)
router.put('/:id/role',
  userController.updateUserRole
);

module.exports = router;
