const Case = require('../models').Case;
const CaseMedia = require('../models').CaseMedia;
const { ErrorHandler } = require('../helpers/errorHandler');
const Storage = require('../aws/awsService');



const add = async ({ title, description, victim, culprit, category_id, status_id }, user_id) => {
    if (!title) throw new ErrorHandler(400, 'A title or subject is required');
    if (!description) throw new ErrorHandler(400, 'A description is required');
    if (!victim) throw new ErrorHandler(400, 'A victim\'s name is required');
    if (!culprit) throw new ErrorHandler(400, 'The culprit is required');
    if (!category_id) throw new ErrorHandler(400, 'This case must be assigned to a category');

    //if a status is not set, we set to new by default
    if (!status_id) {
        status_id = 1 //'new' should always the first
    }
    const data = {
        title,
        description,
        victim,
        culprit,
        category_id,
        status_id,
        user_id
    };
    const addCase = await Case.create(data);

    //check for images/videos and then upload
    if (req.files) {
        const file = req.files
        const fileURL = await Storage.upload(file)
        //add to DB
        const case_id = addCase.id
        let data = {
            case_id,
            fileURL,
        }
        await CaseMedia(data)
    }
    return addCase;
}



module.exports = {
    add
}