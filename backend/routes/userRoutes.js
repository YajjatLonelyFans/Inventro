const express = require('express');
const router = express.Router();
const users = require('../controllers/userControllers');
const protect = require('../middlewares/authMiddleware');
router.post('/register', users.registerUser);
router.post('/login', users.loginUser);
router.get('/logout', users.logout);
router.get('/profile', protect ,users.getUserProfile);
router.get('/loggedin', users.loggedInStatus);
router.put('/update', protect, users.updateUser);
router.put('/changepassword' , protect , users.changePassword)
module.exports = router;