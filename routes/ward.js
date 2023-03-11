const express = require('express');
const router = express.Router();
const wardService = require('../services/wardService');
const authenticate = require('../middlewares/authenticate');
const puService = require('../services/puService');
// const { } = require('../models');



router.post('/new', authenticate, async (req, res, next) => {
    try {
        const { ward_id } = req.session.user;
        const ward = await wardService.save({ ...req.body, result_file: req.files, ward_id, user_id: req.session.user.id });
        res.redirect('/ward/list-all');
    } catch (err) {
        next(err);
    }
});

router.get('/new', authenticate, async (req, res, next) => {
    try {
        const user = req.session.user;
        const puResults = await wardService.fetchPollingUnitResult(user.ward_id);
        res.render('user/new-ward', { puResults, user });
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
