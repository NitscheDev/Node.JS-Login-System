const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
/* __GET__ */

router.get('/', (req,res) => res.redirect('/'));
router.get('/login', (req,res) => res.redirect('/'));
router.get('/signup', (req,res) => res.redirect('/'));

/* __POST__ */

router.post('/login', authController.login);
router.post('/signup', authController.signup);

//Export router
module.exports = router;