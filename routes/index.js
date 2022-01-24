const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userService = require('../services/userService');
const caseService = require('../services/caseService');
const { Admin, CaseCategory, Agency } = require('../models');


router.get('/', async (req, res, next) => {
    try {
        const cases = await caseService.list({
            include: [
                { model: CaseCategory, attributes: ['name'] },
                { model: Agency, attributes: ['abbr'] }
            ]
        });
        res.render('index', { title: 'Welcome', cases, recentCases: cases });
    } catch (err) {
        next(err);
    }
});

router.get('/cases/:id/:title', async (req, res, next) => {
    try {
        const case_id = req.params.id;
        const _case = await caseService.view({
            where: { id: case_id },
            include: [
                { model: CaseCategory, attributes: ['name'] },
                { model: Agency, attributes: ['abbr'] }
            ]
        });
        res.render('case', { _case });
    } catch (err) {
        next(err);
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/signup', async (req, res, next) => {
    try {
        const newUser = await userService.create(req.body);
        res.render('signup', { title: 'Sign Up', newUser });
    } catch (err) {
        next(err);
    }
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
