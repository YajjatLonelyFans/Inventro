const User = require('../models/userModel'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
}

module.exports.registerUser = async (req, res) => {
    const { name, email, password, phone, bio  , Image } = req.body;

    try {

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered' });
        }
        
        const newUser = new User({
            name,
            email,
            password,
            Image,
            phone,
            bio
        });
        await newUser.save();
        const token = generateToken(newUser._id);
        newUser.token = token;
        await newUser.save();
        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            maxAge: 2 * 24 * 60 * 60 * 1000 ,
            sameSite: 'none'
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        const { password: pwd, ...safeUser } = user._doc;
        res.status(200).json({ message: 'User logged in successfully', user: safeUser });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        });
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
