/* eslint-disable no-return-await */
const aws = require('aws-sdk');

class Client {
  constructor(logger, credentials) {
    let inputCreds = credentials;

    this.logger = logger;
    if (credentials.payload) {
      inputCreds = Object.assign(JSON.parse(credentials.payload), credentials);
    }
    const { accessKeyId, secretAccessKey, region } = inputCreds;
    this.s3 = new aws.S3({ accessKeyId, secretAccessKey, region });
  }

  async getFileFromBucket(bucketName, fileName) {
    this.logger.info(`Finding file ${fileName} in bucket: ${bucketName}`);
    const params = {
      Bucket: bucketName,
      Delimiter: '/',
      Prefix: fileName,
    };
    const data = await this.s3.listObjects(params).promise();
    this.logger.trace(`Found data: ${JSON.stringify(data)}`);
    const foundFiles = data.Contents.filter((item) => item.Key === fileName);
    this.logger.trace(`Found file: ${JSON.stringify(foundFiles)}`);
    if (foundFiles.length !== 1) {
      return null;
    }
    return foundFiles[0];
  }

  async copyObject(copySource, bucketName, key) {
    const params = {
      CopySource: encodeURIComponent(copySource),
      Bucket: bucketName,
      Key: key,
    };
    return this.s3.copyObject(params).promise();
  }

  async listObjects(params) {
    return await this.s3.listObjects(params).promise();
  }

  async getObject(bucketName, fileName) {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
    return this.s3.getObject(params).promise();
  }

  async deleteObject(bucketName, fileName) {
    return this.s3.deleteObject({ Bucket: bucketName, Key: fileName }).promise();
  }

  async upload(bucketName, fileName, body) {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: body,
    };

    return this.s3.upload(params).promise();
  }
}
module.exports.Client = Client;
