
const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,              // accessKeyId that is stored in .env file
    secretAccessKey:process.env.AWS_ACCESS_KEY_SECRET       // secretAccessKey is also store in .env file
})


const upload = async ((file) => {
    // Binary data base64
    const fileContent  = Buffer.from(file.uploadedFileName.data, 'binary');
	const params = {
        Bucket:process.env.AWS_BUCKET_NAME,     
        Key:file.originalname,              
        Body:fileContent,                
        ACL:"public-read-write",             
        //ContentType:"image/jpeg"   
    };
    s3.upload(params,(error,data)=>{
        if(error){
            throw new ErrorHandler(500, error);
        }
        return data.Location
    });
});

module.exports = {
    upload
}