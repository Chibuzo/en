const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userService = require('../services/userService');
const caseService = require('../services/caseService');
const { CaseCategory, Agency, CaseMedia } = require('../models');


router.get('/', async (req, res, next) => {
    try {
        const cases = await caseService.list({
            include: [
                { model: CaseCategory, attributes: ['name'] },
                { model: Agency, attributes: ['abbr'] },
                { model: CaseMedia, as: 'media', attributes: ['media_url'] }
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
                { model: Agency, attributes: ['abbr'] },
                { model: CaseMedia, as: 'media', attributes: ['media_url'] }
            ],
            nest: true
        });
        res.render('case', { _case });
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

router.get('/search', async (req, res, next) => {
    try {
        const { keywords } = req.query;
        const cases = await caseService.search(keywords);
        res.render('search', { title: 'Search result', cases });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
