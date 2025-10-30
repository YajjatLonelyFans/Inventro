const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [15, 'Password must not exceed 15 characters'] 
    },
    Image: {
        type: String,
        default:'https://www.w3schools.com/howto/img_avatar.png'
    },
    phone:{
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    bio:{
        type: String,
        maxlength: [200, 'Bio must not exceed 200 characters'],
        default:'Bio not provided'
    }
}, {
    timestamps: true
})
userSchema.pre('save', function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;