import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config()


const s3Bucket = new AWS.S3({
    endpoint: process.env.ENDPOINT,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    sslEnabled: false,
    s3ForcePathStyle: true,
    ACL: 'public-read',
    params: { Bucket: process.env.IMAGE_BUCKET_NAME }
});


const uploadFile = async (base64String) => {
    try {
        const uuid = uuidv4()
        const base64 = base64String
        const type = base64.split(';')[0].split('/')[1];
        const filename = uuid + "." + type
        var buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        const data = {
            Key: filename,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };
        await s3Bucket.putObject(data).promise();
        return filename
    } catch (error) {
        return String(error);
    }
}

const getUrlFromBucket = (fileName) => {
    return `${process.env.ENDPOINT}/${process.env.IMAGE_BUCKET_NAME}/${fileName}`
};

const listObjects = async () => {
    try {
        const params = {
            Bucket: process.env.IMAGE_BUCKET_NAME,
            Delimiter: '/'
        }
        const list = await s3Bucket.listObjects(params).promise()
        return list.Contents

    } catch (error) {
        return String(error);
    }
}

export { uploadFile, getUrlFromBucket, listObjects }
