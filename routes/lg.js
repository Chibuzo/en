const express = require('express');
const router = express.Router();
const wardService = require('../services/wardService');
const lgService = require('../services/lgService');
const authenticate = require('../middlewares/authenticate');
const { VOTE_LEVEL } = require('../config/constants');
const { Vote } = require('../models');



router.post('/new', authenticate, async (req, res, next) => {
    try {
        const { lg_id } = req.session.user;
        const lg = await lgService.save({ ...req.body, result_file: req.files, lg_id, user_id: req.session.user.id });
        res.redirect('/lg/list-all');
    } catch (err) {
        next(err);
    }
});

router.get('/new', authenticate, async (req, res, next) => {
    try {
        // const user = req.session.user;
        // const { lg_id } = user;
        // const lgResult = await lgService.view({
        //     where: { id: lg_id },
        //     include: [{
        //         model: Vote,
        //         as: 'vote',
        //         where: { vote_level: VOTE_LEVEL.lg }
        //     }]
        // });
        res.render('user/new-lg', { user });
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
