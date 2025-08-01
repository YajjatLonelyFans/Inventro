const express = require('express');
const router = express.Router();
const users = require('../controllers/userControllers');
router.post('/register', users.registerUser);
router.post('/login', users.loginUser);
router.get('/logout', users.logoutUser);
router.get('/profile', users.getUserProfile);
module.exports = router;