const jwt = require('jsonwebtoken');
const valix = require('valix');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

//Handle errors

const handleError = (err) => {
    console.log(err.message, err.code);
    let errors = {
        fullname: '',
        email: '',
        password: ''
    }
    //Email already exist error code
    if (err.code === 11000) {
        errors.email = 'Email is already taken';
        return errors;
    }
    //Validation Errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//Create controllers

module.exports.login = async (req,res) => {
    const { email, password } = req.body;
    //Form Validation
    if (valix.isEmpty(email)) return res.status(400).json('Email is required');
    if (valix.isEmpty(password)) return res.status(400).json('Password is required');
    if (email) {
        if (!valix.isEmail(email)) return res.status(400).json('Enter an valid email');
    }
    //Form validation passed here <--
    User.findOne({ email: email })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) console.log(err);
                if (result) {
                    //Create token and cookie <--
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                    res.cookie('UUID', token, { httpOnly: true });
                    res.status(200).json(`Login Success`);
                } else {
                    return res.status(400).json('Password is incorrect');
                }
            });
        } else {
            return res.status(400).json('Email is incorrect');
        }
    })
    .catch(err => console.log(err));
}

module.exports.signup = (req,res) => {
    const { fullname, email, password } = req.body;
    //Form validation
    if (valix.isEmpty(fullname)) return res.status(400).json('Fullname is required');
    if (valix.isEmpty(email)) return res.status(400).json('Email is required');
    if (valix.isEmpty(password)) return res.status(400).json('Password is required');
    if (password) {
        if (valix.isLength(password)) return res.status(400).json('Password is to short');
    }
    if (email) {
        if (!valix.isEmail(email)) return res.status(400).json('Enter an valid email');
    }
    //Form validation passed <--
    User.findOne({ email: email })
    .then(user => {
        if (user) {
            return res.status(400).json('Email is already taken');
        } else {
            const newUser = new User({
                fullname: fullname,
                email: email,
                password: password
            });
            bcrypt.genSalt(10, (err,salt) => {
                if (err) console.log(err);
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if (err) console.log(err);
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        //Create token and cookie <--
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                        res.cookie('UUID', token, { httpOnly: true });
                        res.status(201).json('Account Created');
                    })
                    .catch(err => console.log(err));
                });
            })
        }
    })
    .catch(err => console.error(err)); 
}