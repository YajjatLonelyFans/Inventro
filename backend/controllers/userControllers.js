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

        // Validate phone number format (exactly 10 digits)
        if (!phone || !/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
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
        
       res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        maxAge: 2 * 24 * 60 * 60 * 1000
        });


        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ message: 'Server error during registration' });
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

module.exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...safeUser } = user._doc;
        res.status(200).json({ user: safeUser });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.loggedInStatus = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
        return res.json(false);
    }
    return res.json(true);
}
module.exports.updateUser = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateData = await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!updateData) {
            return res.status(400).json({ message: 'Error updating user' });
        }
        const { password, ...safeUser } = updateData._doc;
        res.status(200).json({ message: 'User updated successfully', user: safeUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 
module.exports.changePassword = async (req , res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide both old and new passwords' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
