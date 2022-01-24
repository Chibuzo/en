const express = require('express');
const router = express.Router();
const { Admin } = require('../models');
const adminService = require('../services/adminService');
const caseService = require('../services/caseService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');


router.get('/', function (req, res) {
    res.render('admin/login', { title: 'Admin Login' });
});

router.post('/create', async (req, res, next) => {
    try {
        await adminService.create(req.body);
        res.redirect('/admin/users');
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        req.session.admin = await adminService.login(req.body);
        res.redirect('/admin/cases');
    } catch (err) {
        next(err);
    }
});

router.get('/users', async (req, res, next) => {
    const users = await adminService.list();
    res.render('admin/users', { users });
});

router.get('/cases', authenticateAdmin, async (req, res, next) => {
    try {
        const cases = await caseService.list({ include: { model: Admin, attributes: ['fullname'] } });
        res.render('admin/cases', { cases });
    } catch (err) {
        next(err);
    }
});

router.get('/new-case', authenticateAdmin, async (req, res, next) => {
    try {
        const [categories, agencies] = await Promise.all([
            caseService.getCategories(),
            caseService.getAgencies()
        ]);
        res.render('admin/new-case', { agencies, categories });
    } catch (err) {
        next(err);
    }
});

router.get('/edit-case/:id', authenticateAdmin, async (req, res, next) => {
    try {
        const [_case, categories, agencies] = await Promise.all([
            caseService.view({ where: { id: req.params.id } }),
            caseService.getCategories(),
            caseService.getAgencies()
        ]);
        res.render('admin/edit-case', { _case, categories, agencies });
    } catch (err) {
        next(err);
    }
});

router.post('/cases', authenticateAdmin, async (req, res, next) => {
    try {
        await caseService.save({ ...req.body, AdminId: req.session.admin.id });
        const cases = await caseService.list({ include: { model: Admin, attributes: ['fullname'] } });
        res.render('admin/cases', { cases });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
