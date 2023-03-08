const express = require('express');
const router = express.Router();
const wardService = require('../services/wardService');
const puService = require('../services/puService');
// const { } = require('../models');
const { VOTE_LEVEL } = require('../config/constants');



router.post('/new', async (req, res, next) => {
    try {
        const pu = await wardService.create(req.body, req.session.user.id)
        //render
    } catch (err) {
        next(err);
    }
});

router.get('/list-all', async (req, res, next) => {
    try {
        const { ward_id } = req.session.user;
        const puResults = await wardService.fetchPollingUnitResult(ward_id);
        res.render('user/pu_result', { puResults, user: req.session.user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
