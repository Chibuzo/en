const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userService = require('../services/userService');
const puService = require('../services/puService');
// const { buildData } = require('../services/UtillityService');
const { Vote } = require('../models');


router.get('/', async (req, res, next) => {
    try {
        res.render('index', { title: 'Welcome' });
    } catch (err) {
        next(err);
    }
});


router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});


router.post('/login', async (req, res, next) => {
    try {
        req.session.user = await userService.login(req.body);
        res.redirect('/users/dashboard');
    } catch (err) {
        next(err);
    }
});



module.exports = router;
