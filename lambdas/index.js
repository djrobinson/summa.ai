const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const parsefile = async (req) => {
    const body = JSON.parse(req.body);
    console.log("parsefile", body);
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
            Key: `${body.identifier}.txt`,
            Body: body.data
        }
    }).done()
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'File uploaded successfully',
            url: `https://${Bucket}.s3.${region}.amazonaws.com/${body.identifier}.txt`
        })
    }
}

module.exports.handler = parsefile;