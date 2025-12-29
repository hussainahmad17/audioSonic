// routes/authRoutes.js
const express = require('express');
const { register, login, logout, verifyToken, GetAllUsers, changePassword} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify', verifyToken);
router.post('/getallusers'  , GetAllUsers);
router.put("/change-password", protect, changePassword);

module.exports = router;