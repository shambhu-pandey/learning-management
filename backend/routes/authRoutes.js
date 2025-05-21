

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { register, login, getProfile } = require('../controllers/authController');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile);

module.exports = router;


