
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const readfile = async (req) => {
    // upload to S3
    const body = JSON.parse(req.body);
    console.log("readfile", body);
    let data = '';

        const client= new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            region
        })
        const command = new GetObjectCommand({
            Bucket: Bucket,
            Key: `${body.identifier}.txt`
        });
    
      try {
        const response = await client.send(command);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        data = await response.Body.transformToString();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data
        })
    }
}

module.exports.handler = readfile;