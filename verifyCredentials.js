const { Client } = require('./lib/client');

module.exports = function verifyCredentials(credentials, cb) {
  return Promise.resolve().then(async () => {
    this.logger.info('Verification started');
    let inputCreds = credentials;
    if (credentials.payload) {
      inputCreds = Object.assign(JSON.parse(credentials.payload), credentials);
    }
    const { accessKeyId, accessKeySecret: secretAccessKey, region } = inputCreds;
    if (!accessKeyId || !secretAccessKey || !region) {
      const errMessage = 'Parameters accessKeyId, secretAccessKey and region are required';
      this.logger.error(errMessage);
      throw new Error(errMessage);
    }
    this.logger.trace('Current credentials: %j', credentials);
    const client = new Client(this.logger, credentials);
    await client.listObjects({ Bucket: '' });
    this.logger.info('Verification succeeded');
    cb(null, { verified: true });
    return { verified: true };
  }).catch((err) => {
    this.logger.error('Error occurred', err.stack || err);
    cb(err, { verified: false });
    return { verified: false };
  });
};
