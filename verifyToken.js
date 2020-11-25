const jwt = require('jsonwebtoken');
require('dotenv').config();
//If user is NOT authed. -- Used for pages that can only be viewn if you are logged in!
const requireAuth = (req,res,next) => {
    const token = req.cookies.UUID;
    //Check if token exist and verify it
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            }
            else {
                //console.log(decodedToken);
                next();
            }
        });
    } 
    else {
        res.redirect('/login');
    }
}

//If user is authed. -- Used for pages you can not view while logged in!
const requireNoAuth = (req,res,next) => {
    const token = req.cookies.UUID;
    //Check if user has a token means user is logged in
    if (token) {
        console.log('Authed user tryed to access login / register page');
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = { requireAuth, requireNoAuth };