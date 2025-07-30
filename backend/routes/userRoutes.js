const express = require('express');
const router = express.Router();
const users = require('../controllers/userControllers');
router.post('/register', users.registerUser);
module.exports = router;