const express = require('express');
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authMiddleware.verifyToken, userController.logoutUser);

module.exports = router;
