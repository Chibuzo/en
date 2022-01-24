const express = require('express');
const router = express.Router();
const CaseCategory = require('../models').CaseCategory;
const CaseStatus = require('../models').CaseStatus;
const CaseService = require('../services/caseService');
const Case = require('../models/case').Case;

//Form to add a case
router.get('/cases', function (req, res) {
    const categories = CaseCategory.findAll();
    const statuses = CaseStatus.findAll();
    //render to view
});

//Handle case submission
router.post('/cases', async (req, res, next) => {
    try {
        const newCase = await CaseService.create(req.body, req.session.user.id)
        //render
    } catch (err) {
        next(err);
    }
});

//Retrieve all cases
router.get('/cases', async (req, res, next) => {
    try {
        const add = await Case.find()
        //render
    } catch (err) {
        next(err);
    }
})

module.exports = router;
