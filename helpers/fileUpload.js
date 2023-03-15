const { ErrorHandler } = require('./errorHandler');

const uploadFile = (file, filename) => {
    if (!file || Object.keys(file).length === 0) {
        throw new ErrorHandler(400, 'No files were uploaded.');
    }
    // check file type
    const allowedFileTypes = ['image/png', 'image/jpeg'];
    if (!allowedFileTypes.includes(file.mimetype)) {
        throw new ErrorHandler(400, 'Unsupported file type');
    }
    const ext = file.result_file.name.split('.').pop();
    const resultName = `results/${filename}.${ext}`;
    const uploadPath = require('path').resolve(__dirname, '../public', resultName);
    file.result_file.mv(uploadPath);
    return resultName;
}

module.exports = {
    uploadFile
}