const express = require('express');
const router = express.Router();
const wardService = require('../services/wardService');
const authenticate = require('../middlewares/authenticate');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const puService = require('../services/puService');
const { PollingUnit, Ward } = require('../models');



router.post('/new', authenticate, async (req, res, next) => {
    try {
        const user = req.session.user;
        const ward = await wardService.save({ ...req.body, result_file: req.files, user_id: user.id });
        res.redirect('/confirmation');
    } catch (err) {
        next(err);
    }
});

router.get('/new', authenticate, async (req, res, next) => {
    try {
        const { agentData } = req.session.user;
        // const puResults = await wardService.fetchPollingUnitResult(user.ward_id);
        res.render('user/new-ward', { agentData });
    } catch (err) {
        next(err);
    }
});

router.get('/fetch', authenticate, async (req, res, next) => {
    try {
        const { ward_id } = req.query;
        const pus = await PollingUnit.findAll({ where: { ward_id } });
        res.json({ status: 'true', data: pus });
    } catch (err) {
        next(err);
    }
});

router.get('/fetch-wards', authenticate, async (req, res, next) => {
    try {
        const { lg_id } = req.query;
        const wards = await Ward.findAll({ where: { lg_id } });
        res.json({ status: 'true', data: wards });
    } catch (err) {
        next(err);
    }
});

router.get('/list-all', authenticateAdmin, async (req, res, next) => {
    try {
        const { ward_id } = req.session.user;
        const puResults = await wardService.fetchPollingUnitResult(ward_id);
        res.render('user/pu_result', { puResults, user: req.session.user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
