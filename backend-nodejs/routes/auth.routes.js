const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Temporary placeholder for authorize middleware (you can replace with your actual authorization logic)
const authorize = () => (req, res, next) => next();

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Admin route (requires admin authorization)
router.get('/admin', authorize(['admin']), (req, res) => {
  res.send('Admin dashboard');
});

module.exports = router;
