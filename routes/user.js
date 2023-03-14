const express = require('express');
const router = express.Router();
const { Lg, Ward } = require('../models');
const userService = require('../services/userService');
const puService = require('../services/puService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { readData } = require('../services/UtillityService');

const userPage = {
    state: '',
    lg: '/lg/new',
    ward: '/ward/new',
    pu: '/pu/new',
    admin: '/users/'
};

router.get('/', async (req, res, next) => {
    try {
        const [users, lgs, wards] = await Promise.all([
            userService.list(),
            Lg.findAll({ where: { state_id: 14 }, order: [['name']] }),
            Ward.findAll({ where: { state_id: 14 }, order: [['name']] })
        ]);
        res.render('user/users', { users, lgs, wards });
    } catch (err) {
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    try {
        await userService.create(req.body);
        res.redirect('/users');
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await userService.login(req.body);
        req.session.user = user;
        res.redirect('/pu/new');
    } catch (err) {
        next(err);
    }
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
