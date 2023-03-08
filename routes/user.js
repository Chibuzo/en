const express = require('express');
const router = express.Router();
const { User } = require('../models');
const userService = require('../services/userService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { readData } = require('../services/UtillityService');

const userPage = {
    state: '',
    lg: '',
    ward: 'new-ward',
    pu: 'new-pu'
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
        res.redirect(`/users/${userPage[user.role]}`);
    } catch (err) {
        next(err);
    }
});

router.get('/users', async (req, res, next) => {
    const users = await userService.list();
    res.render('user/users', { users });
});



router.get('/new-pu', async (req, res, next) => {
    try {
        const user = req.session.user
        res.render('user/new-pu', { user });
    } catch (err) {
        next(err);
    }
});

router.get('/edit-case/:id', authenticateAdmin, async (req, res, next) => {
    try {

        //res.render('admin/edit-case', { });
    } catch (err) {
        next(err);
    }
});

router.get('/new-ward', async (req, res, next) => {
    try {
        const user = req.session.user
        res.render('user/new-ward', { user });
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
