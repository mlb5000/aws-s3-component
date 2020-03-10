const { messages } = require('elasticio-node');
const { Client } = require('../client');

// eslint-disable-next-line func-names
exports.process = async function (msg, cfg) {
  this.logger.trace('Input: %j, Cfg: %j', JSON.stringify(msg), JSON.stringify(cfg));
  const client = new Client(this.logger, cfg);

  const result = await client.sendSqsMessage(cfg.sqsQueue, msg);
  this.logger.trace('Result: %j', JSON.stringify(result));

  await this.emit('data', messages.newMessageWithBody(msg));
};
