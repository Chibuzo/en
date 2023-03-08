const express = require('express');
const router = express.Router();
const { User } = require('../models');
const puService = require('../services/puService');
const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, async (req, res, next) => {
    try {
        const pu = await puService.save({ ...req.body, result_file: req.files, user_id: req.session.user.id });
        res.render('user/pu', { pu });
    } catch (err) {
        next(err);
    }
});


module.exports = router;