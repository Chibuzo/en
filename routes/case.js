const express = require('express');
const router = express.Router();
const CaseCategory = require('../models').CaseCategory;
const CaseStatus = require('../models').CaseStatus;
const CaseService = require('../services/caseService');

//Form to add a case
router.get('/cases/add', function (req, res) {
    const categories = CaseCategory.findAll();
    const statuses =  CaseStatus.findAll();
    //render to view
});

//Handle case submission
router.post('/cases/add', async (req, res, next) => {
    try {
        const add = await CaseService.create(req.body, req.session.user.id)
        //render
    } catch (err) {
        next(err);
    }
});


module.exports = router;
