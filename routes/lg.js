const express = require('express');
const router = express.Router();
const wardService = require('../services/wardService');
const lgService = require('../services/lgService');
const authenticate = require('../middlewares/authenticate');
const { VOTE_LEVEL } = require('../config/constants');
const { Vote } = require('../models');



router.post('/new', authenticate, async (req, res, next) => {
    try {
        const user = req.session.user;
        const lg = await lgService.save({ ...req.body, result_file: req.files, user_id: user.id });
        res.redirect('/confirmation');
    } catch (err) {
        next(err);
    }
});

router.get('/new', authenticate, async (req, res, next) => {
    try {
        const user = req.session.user;
        res.render('user/new-lg', { lgs: user.agentData.lg });
    } catch (err) {
        next(err);
    }
});

router.get('/list-all', authenticate, async (req, res, next) => {
    try {
        const { ward_id } = req.session.user;
        const puResults = await wardService.fetchPollingUnitResult(ward_id);
        res.render('user/pu_result', { puResults, user: req.session.user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
