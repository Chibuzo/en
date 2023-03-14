const express = require('express');
const router = express.Router();
const { Vote, Lg, Ward } = require('../models');
const puService = require('../services/puService');
const authenticate = require('../middlewares/authenticate');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { VOTE_LEVEL } = require('../config/constants');

router.post('/', authenticate, async (req, res, next) => {
    try {
        const user = req.session.user;
        await puService.save({ ...req.body, result_file: req.files, user_id: user.id });
        res.redirect('/pu/new');
    } catch (err) {
        next(err);
    }
});


router.get('/new', authenticate, async (req, res, next) => {
    try {
        const { agentData } = req.session.user;
        res.render('user/new-pu', { agentData });
    } catch (err) {
        next(err);
    }
});

router.get('/results', authenticateAdmin, async (req, res, next) => {
    try {
        const { lg_id = 0, ward_id = 0 } = req.query;
        const [puResults, lgs] = await Promise.all([
            puService.list({
                where: { ward_id },
                include: [{
                    model: Vote,
                    as: 'vote',
                    where: { vote_level: VOTE_LEVEL.pu }
                }]
            }),
            Lg.findAll({ where: { state_id: 14 } })
        ]);
        console.log({ puResults })
        res.render('user/pu_result', { puResults, lgs, lg_id });
    } catch (err) {
        next(err);
    }
});

module.exports = router;