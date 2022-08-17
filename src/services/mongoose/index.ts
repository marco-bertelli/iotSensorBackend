/* eslint-disable no-console */
import mongoose from 'mongoose';
import logger from '../logger/index';

import Config from '../../config';

const { mongo } = Config;

const Promise = require('bluebird');

Object.keys(mongo.options).forEach(key => {
  if (key === 'debug' && mongo.options[key]) {
    mongoose.set('debug', winstonMongooseLogger);
  }
});

function winstonMongooseLogger(name: any, i: any) {
  let moduleName = '\x1B[0;36mMongoose:\x1B[0m ';
  let functionCall = [name, i].join('.');
  let _args = [];
  for (let j = arguments.length - 1; j >= 2; --j) {
    _args.unshift(JSON.stringify(arguments[j]));
  }
  let params = '(' + _args.join(', ') + ')';

  logger ? logger.info(moduleName + functionCall + params) : console.log(moduleName + functionCall + params);
}

mongoose.Promise = Promise;

/* istanbul ignore next */
mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});


export default mongoose;
