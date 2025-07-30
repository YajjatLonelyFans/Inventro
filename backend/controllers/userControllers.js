const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

module.exports.registerUser = async (req, res) => {
    const { name, email, password, phone, bio } = req.body;

    try {

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password,
            phone,
            bio
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}