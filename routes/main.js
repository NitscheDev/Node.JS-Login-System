const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');;

const { requireAuth, requireNoAuth } = require('../verifyToken');
/* __GET__ */
router.get('/', requireAuth, async (req,res) => {
    const token = req.cookies.UUID;
    const decoded = jwt.decode(token);
    const id = decoded._id;

    User.findById(id, async (err, user) => {
        if (err) console.log(err);
        if (user) {
            res.render('index', {
                fullname: user.fullname
            });    
        }
    });
});

router.get('/login', requireNoAuth, (req,res) => res.render('user/login'));
router.get('/signup', requireNoAuth, (req,res) => res.render('user/signup'));
router.get('/logout', requireAuth, (req,res) => {
    /*
        We can't actually delete cookies from server. So what we do is that we clear the cookie. 
        Basicaly make it blank and set it maxAge to 1 millisecond. Which will than delete / clear token from it
        and after 1 millisec it will die / get delete ;)
     */
    res.cookie('UUID', '', { maxAge: 1 });
    //Also here we just redirect to loginpage ;)
    res.redirect('/login');
});
/* __POST__ */

//Export router
module.exports = router;

const getUserbyId = (id) => {
    let info = [];
}