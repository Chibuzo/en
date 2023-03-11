const { PollingUnit, Ward, Vote, Lg } = require('../models');
const { uploadFile } = require('../helpers/fileUpload');
const { ErrorHandler } = require('../helpers/errorHandler');
const { buildCriteria } = require('./UtillityService');
const { AGENT_LEVEL } = require('../config/constants');
const puService = require('./puService');


const save = async ({ result_file, lg_id, user_id, ...parties }) => {
    const lg = await Lg.findByPk(lg_id);
    if (!lg) throw new ErrorHandler(400, 'Invalid Local government');

    const result_sheet = uploadFile(result_file, `lg_${lg_id}`);

    const rawVote = await lg.createVote({
        parties: JSON.stringify(parties),
        vote_level: AGENT_LEVEL.lg,
        vote_level_id: lg_id
    });
    const vote = rawVote.toJSON();
    // ward.total_accredited_voters = total_accredited_voters;
    // ward.total_valid_votes = total_valid_votes;
    lg.vote_id = vote.id;
    lg.result_sheet = result_sheet;
    await lg.save();
    return { ...lg.toJSON(), vote: parties };
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