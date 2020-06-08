const { messages } = require('elasticio-node');
const { Client } = require('../client');
const odinErrorHandling = require('../odin_error_handling');

// eslint-disable-next-line func-names
exports.process = async function (msg, cfg) {
  odinErrorHandling.initialize(cfg);

  try {
    console.log('Input: %j, Cfg: %j', JSON.stringify(msg), JSON.stringify(cfg));
    const client = new Client(this.logger, cfg);

    const result = await client.sendSqsMessage(cfg.sqsQueue, msg);
    console.log('Result: %j', JSON.stringify(result));

    await this.emit('data', messages.newMessageWithBody(msg));
  } catch (err) {
    odinErrorHandling.onError(err);
  }
};
