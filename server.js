const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config();

//Start server
app.listen(process.env.SERVER_PORT, () => console.log('Server started...'));

//Database connection
const dbOptions = {  useUnifiedTopology: true,useNewUrlParser: true }
mongoose.connect(process.env.DB_STRING, dbOptions, (err) => {
    if (err) return console.err(err);
    console.log('MongoDB Connected...');
});

//Middlewere's
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
//View Engine
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/main'));
app.use('/auth', require('./routes/auth'));
