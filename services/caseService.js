const { Case, CaseCategory, Agency } = require('../models');
const CaseMedia = require('../models').CaseMedia;
const { ErrorHandler } = require('../helpers/errorHandler');
const Storage = require('../aws/awsService');
const { buildCriteria } = require('../services/UtillityService');



const save = async ({ title, description, CaseCategoryId, event_date, AdminId, AgencyId, id }) => {
    if (!title) throw new ErrorHandler(400, 'A title or subject is required');
    if (!description) throw new ErrorHandler(400, 'A description is required');
    if (!CaseCategoryId) throw new ErrorHandler(400, 'This case must be assigned to a category');

    //if a status is not set, we set to new by default
    // if (!status_id) {
    //     status_id = 1 //'new' should always the first
    // }
    const data = {
        title,
        description,
        CaseCategoryId,
        event_date,
        AdminId,
        AgencyId
    };

    let _case;
    if (id) {
        _case = await Case.update(data, { where: { id } });
    } else {
        _case = await Case.create(data);
    }

    //check for images/videos and then upload
    // if (files) {
    //     const file = req.files
    //     const fileURL = await Storage.upload(file)
    //     //add to DB
    //     const case_id = _case.id
    //     let data = {
    //         case_id,
    //         fileURL,
    //     }
    //     await CaseMedia(data)
    // }
    return _case;
}

const view = async criteria => {
    const { where, params } = buildCriteria({ ...criteria, raw: true });
    return Case.findOne({ where, ...params });
}

const list = async criteria => {
    const { where, params } = buildCriteria(criteria);

    const cases = await Case.findAll({
        where,
        order: [
            ['createdAt', 'DESC']
        ],
        ...params
    });

    return cases.map(_case => sanitizeCase(_case));
}

const getCategories = async () => {
    const categories = await CaseCategory.findAll({});
    return categories.map(cateogry => ({ ...cateogry.toJSON() }));
}

const getAgencies = async () => {
    const agencies = await Agency.findAll({});
    return agencies.map(agency => ({ ...agency.toJSON() }));
}

const sanitizeCase = _case => {
    return { ..._case.toJSON() };
}



module.exports = {
    save,
    list,
    view,
    getCategories,
    getAgencies
}