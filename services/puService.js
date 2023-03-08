const { PollingUnit, Sequelize } = require('../models');
const { uploadFile } = require('../helpers/fileUpload');
const { ErrorHandler } = require('../helpers/errorHandler');
const { buildCriteria } = require('./UtillityService');
const { AGENT_LEVEL } = require('../config/constants');

const nullVotes = { apc: 0, apga: 0, lp: 0, pdp: 0 };

const save = async ({ ward_id, pu_id, total_accredited_voters, total_valid_votes, result_file, user_id, ...parties }) => {
    const pu = await PollingUnit.findByPk(pu_id);
    if (!pu) throw new ErrorHandler(400, 'Invalid polling unit');

    const result_sheet = uploadFile(result_file, pu.delimiter);

    const rawVote = await pu.createVote({
        parties: JSON.stringify(parties),
        vote_level: AGENT_LEVEL.pu,
        vote_level_id: pu_id
    });
    const vote = rawVote.toJSON();
    pu.result_sheet = result_sheet;
    pu.total_accredited_voters = total_accredited_voters;
    pu.total_valid_votes = total_valid_votes;
    pu.vote_id = vote.id;
    await pu.save();
    return { ...pu.toJSON(), vote: parties };
}


const view = async criteria => {
    const { where, params } = buildCriteria({ ...criteria });
    const pu = await PollingUnit.findOne({ where, ...params });
    return sanitizeCase(pu.toJSON());
}

const list = async criteria => {
    const pus = await PollingUnit.findAll({
        ...criteria,
        order: [
            ['updatedAt', 'DESC']
        ],
        nest: true,
        raw: true
    });
    let accredited_voters = 0, valid_votes = 0, parties = { apc: 0, apga: 0, lp: 0, pdp: 0 };
    const _pus = pus.map(pu => {
        accredited_voters += parseInt(pu.total_accredited_voters || 0);
        valid_votes += parseInt(pu.total_valid_votes || 0);
        const vote = pu.vote.id ? JSON.parse(pu.vote.parties) : nullVotes;
        parties.apc += parseInt(vote.apc);
        parties.apga += parseInt(vote.apga, 10);
        parties.lp += parseInt(vote.lp);
        parties.pdp += parseInt(vote.pdp, 10);
        return { ...pu, vote };
    });

    _pus.total_accredited_voters = accredited_voters;
    _pus.total_valid_votes = valid_votes;
    _pus.parties = parties;

    return _pus;
}


const sanitizeCase = pu => {
    return { ...pu };
}

module.exports = {
    save,
    list,
    view
}