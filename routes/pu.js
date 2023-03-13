const express = require('express');
const router = express.Router();
const { Vote } = require('../models');
const puService = require('../services/puService');
const authenticate = require('../middlewares/authenticate');
const { VOTE_LEVEL } = require('../config/constants');

router.post('/', authenticate, async (req, res, next) => {
    try {
        const user = req.session.user;
        await puService.save({ ...req.body, result_file: req.files, user_id: user.id });
        res.redirect('/confirmation');
    } catch (err) {
        next(err);
    }
});


router.get('/new', authenticate, async (req, res, next) => {
    try {
        const { agentData } = req.session.user;
        console.log({ agentData })
        res.render('user/new-pu', { agentData });
    } catch (err) {
        next(err);
    }
});

module.exports = router;