const express = require('express');
const router = express.Router();
const { User } = require('../models');
const userService = require('../services/userService');
const puService = require('../services/puService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { readData } = require('../services/UtillityService');

const userPage = {
    state: '',
    lg: '/lg/new',
    ward: '/ward/new',
    pu: '/pu/new'
};

router.get('/', function (req, res) {
    res.render('user/login', { title: 'Admin Login' });
});

router.post('/create', async (req, res, next) => {
    try {
        await userService.create(req.body);
        res.redirect('/users/users');
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await userService.login(req.body);
        req.session.user = user;
        res.redirect(userPage[user.role]);
    } catch (err) {
        next(err);
    }
});

router.get('/users', async (req, res, next) => {
    const users = await userService.list();
    res.render('user/users', { users });
});

router.get('/new-lg', authenticateAdmin, async (req, res, next) => {
    try {
        res.render('admin/new-lg', {});
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;
