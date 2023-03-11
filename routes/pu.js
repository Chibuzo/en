const express = require('express');
const router = express.Router();
const { Vote } = require('../models');
const puService = require('../services/puService');
const authenticate = require('../middlewares/authenticate');
const { VOTE_LEVEL } = require('../config/constants');

router.post('/', authenticate, async (req, res, next) => {
    try {
        const pu = await puService.save({ ...req.body, result_file: req.files, user_id: req.session.user.id });
        const user = req.session.user;
        res.render('user/new-pu', { pu, user });
    } catch (err) {
        next(err);
    }
});


router.get('/new', async (req, res, next) => {
    try {
        const user = req.session.user;
        const pu = await puService.view({
            where: { id: user.pu_id },
            include: [{
                model: Vote,
                as: 'vote',
                where: { vote_level: VOTE_LEVEL.pu }
            }]
        });
        res.render('user/new-pu', { pu, user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;