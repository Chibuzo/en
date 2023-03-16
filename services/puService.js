const { PollingUnit, Vote } = require('../models');
const { uploadFile } = require('../helpers/fileUpload');
const { ErrorHandler } = require('../helpers/errorHandler');
const { AGENT_LEVEL, VOTE_LEVEL } = require('../config/constants');
const { Op } = require("sequelize");

const nullVotes = { apc: 0, apga: 0, lp: 0, pdp: 0, others: 0 };

const save = async ({ ward_id, pu_id, total_accredited_voters, total_valid_votes, result_file, user_id, ...parties }) => {
    if (!isPositiveInteger(total_accredited_voters)) throw new ErrorHandler(400, 'Total accredited voters must be a positive number');
    if (!isPositiveInteger(total_valid_votes)) throw new ErrorHandler(400, 'Total valid votes must be a positive number');

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
    const pu = await PollingUnit.findOne(criteria);
    const vote = pu.vote.id ? JSON.parse(pu.vote.parties) : nullVotes;
    return { ...pu.toJSON(), vote };
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
    let accredited_voters = 0, valid_votes = 0, parties = { apc: 0, apga: 0, lp: 0, pdp: 0, others: 0 };
    const _pus = pus.map(pu => {
        accredited_voters += parseInt(pu.total_accredited_voters || 0);
        valid_votes += parseInt(pu.total_valid_votes || 0);
        const vote = pu.vote.id ? JSON.parse(pu.vote.parties) : nullVotes;
        parties.apc += parseInt(vote.apc);
        parties.apga += parseInt(vote.apga, 10);
        parties.lp += parseInt(vote.lp);
        parties.pdp += parseInt(vote.pdp, 10);
        const subTotal = parseInt(vote.apc) + parseInt(vote.apga, 10) + parseInt(vote.lp) + parseInt(vote.pdp, 10);
        vote.others = (pu.total_valid_votes || 0) - subTotal;
        parties.others += vote.others;
        return { ...pu, vote };
    });

    _pus.total_accredited_voters = accredited_voters;
    _pus.total_valid_votes = valid_votes;
    _pus.parties = parties;

    return _pus;
}

const computeResult = async criteria => {
    const result = await list({
        where: { vote_id: { [Op.gt]: 0 } },
        include: [{
            model: Vote,
            as: 'vote',
            where: { vote_level: VOTE_LEVEL.pu }
        }]
    });

    return Object.keys(result.parties).map(party => {
        return {
            [party]: {
                votes: result.parties[party],
                percentage: Math.round((result.parties[party] / result.total_valid_votes) * 100)
            }
        }
    });
}


const isPositiveInteger = num => {
    const isInteger = Number.isInteger(Number(num));
    const isPositive = num > 0;
    return isInteger && isPositive;
}

module.exports = {
    save,
    list,
    view,
    computeResult
}