const mongoose = require('mongoose');
const { isEmail } = require('valix');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Your name is required'],
        max: 255
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        max: [255, 'Email is to long'],
        lowercase: true,
        unique: true,
        validate: [isEmail, 'Enter an valid email']
    }
});

module.exports = mongoose.model('User', UserSchema, 'users');