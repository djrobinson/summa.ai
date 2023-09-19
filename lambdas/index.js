const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const Transform = require('stream').Transform;
const formidable = require('formidable-serverless');

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const parsefile = async (req) => {
    console.log("parsefile", req);
    // upload to S3
    await new Upload({
        client: new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            region
        }),
        params: {
            ACL: 'public-read',
            Bucket,
            Key: `${Date.now().toString()}-${this.originalFilename}`,
            Body: req.body
        }
    }).done()
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'File uploaded successfully',
            url: `https://${Bucket}.s3.${region}.amazonaws.com/${this.originalFilename}`
        })
    }
}

module.exports.handler = parsefile;