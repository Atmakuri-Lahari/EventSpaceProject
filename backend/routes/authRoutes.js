const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware'); // ✅ Fix import

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile); // ✅ Now it's correctly used

module.exports = router;
