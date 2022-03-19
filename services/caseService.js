const { Case, CaseCategory, CaseMedia, Agency, Sequelize } = require('../models');
const { uploadFile } = require('../helpers/fileUpload');
const { ErrorHandler } = require('../helpers/errorHandler');
// const Storage = require('../aws/awsService');
const { buildCriteria } = require('../services/UtillityService');



const save = async ({ title, description, CaseCategoryId, event_date, status = 'new', gender, age, location, news_link, AdminId, AgencyId, id }, files) => {
    if (!title) throw new ErrorHandler(400, 'A title or subject is required');
    if (!description) throw new ErrorHandler(400, 'A description is required');
    if (!CaseCategoryId) throw new ErrorHandler(400, 'This case must be assigned to a category');

    const data = {
        title,
        description,
        gender,
        age,
        location,
        CaseCategoryId,
        event_date,
        news_link,
        status,
        AdminId,
        AgencyId
    };

    let _case;
    if (id) {
        _case = await Case.update(data, { where: { id } });
    } else {
        _case = await Case.create(data);
    }

    if (files) {
        const fileLocations = uploadFile(files);
        const CaseId = _case.id
        const mediaData = fileLocations.map(file => ({
            CaseId,
            media_url: file
        }));
        await CaseMedia.bulkCreate(mediaData);
    }
    return _case;
}

const view = async criteria => {
    const { where, params } = buildCriteria({ ...criteria });
    const _case = await Case.findOne({ where, ...params });
    return sanitizeCase(_case);
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

const search = async keywords => {
    const cases = await Case.findAll({
        where: Sequelize.literal(`MATCH (title, description) AGAINST ('${keywords}')`),
        include: [
            { model: CaseCategory, attributes: ['name'] },
            { model: Agency, attributes: ['abbr'] },
            { model: CaseMedia, as: 'media', attributes: ['media_url'] }
        ]
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

const deleteCase = async id => {
    return Case.update({ deleted: true }, { where: { id } });
}

const sanitizeCase = _case => {
    return { ..._case.toJSON() };
}



module.exports = {
    save,
    list,
    view,
    search,
    deleteCase,
    getCategories,
    getAgencies
}