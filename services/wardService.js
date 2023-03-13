const { PollingUnit, Ward, Vote } = require('../models');
const { uploadFile } = require('../helpers/fileUpload');
const { ErrorHandler } = require('../helpers/errorHandler');
const { buildCriteria } = require('./UtillityService');
const { AGENT_LEVEL } = require('../config/constants');
const puService = require('./puService');


const save = async ({ result_file, ward_id, user_id, ...parties }) => {
    const ward = await Ward.findByPk(ward_id);
    if (!ward) throw new ErrorHandler(400, 'Invalid Ward');

    const result_sheet = uploadFile(result_file, `ward_${ward_id}`);

    const rawVote = await ward.createVote({
        parties: JSON.stringify(parties),
        vote_level: AGENT_LEVEL.ward,
        vote_level_id: ward_id
    });
    const vote = rawVote.toJSON();
    // ward.total_accredited_voters = total_accredited_voters;
    // ward.total_valid_votes = total_valid_votes;
    ward.vote_id = vote.id;
    ward.result_sheet = result_sheet;
    await ward.save();
    return { ...ward.toJSON(), vote: parties };
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


module.exports = {
    save,
    fetchPollingUnitResult
}