const { PollingUnit, Ward, Vote, Sequelize } = require('../models');
const { uploadFile } = require('../helpers/fileUpload');
const { ErrorHandler } = require('../helpers/errorHandler');
const { buildCriteria } = require('./UtillityService');
const { AGENT_LEVEL } = require('../config/constants');
const puService = require('./puService');


const save = async ({ lg_id, ward_id, pu_id, total_accredited_voters, total_valid_votes, user_id, ...parties }) => {
    const ward = await Ward.findByPk(ward_id);
    if (!ward) throw new ErrorHandler(400, 'Invalid Ward');

    const rawVote = await ward.createVote({
        parties: JSON.stringify(parties),
        vote_level: AGENT_LEVELS.ward,
        vote_level_id: ward_id
    });
    const vote = rawVote.toJSON();
    ward.total_accredited_voters = total_accredited_voters;
    ward.total_valid_votes = total_valid_votes;
    ward.vote_id = vote.id;
    await ward.save();
    return { ...ward.toJSON(), vote: parties };
}


const view = async criteria => {
    const { where, params } = buildCriteria({ ...criteria });
    const pu = await PollingUnit.findOne({ where, ...params });
    return sanitizeCase(pu.toJSON());
}

const list = async criteria => {
    const { where, params } = buildCriteria(criteria);

    const pus = await PollingUnit.findAll({
        where,
        order: [
            ['createdAt', 'DESC']
        ],
        nest: true,
        raw: true
    });

    return pus.map(pu => sanitizeCase(pu));
}

const fetchPollingUnitResult = async ward_id => {
    return puService.list({
        where: { ward_id },
        include: [{
            model: Vote,
            as: 'vote',
            where: { vote_level: AGENT_LEVEL.pu }
        }]
    });
}


const sanitizeCase = pu => {
    return { ...pu };
}

module.exports = {
    save,
    list,
    view,
    fetchPollingUnitResult
}