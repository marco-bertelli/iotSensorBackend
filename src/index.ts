require('babel-core/register');

// ! use blubird promises instead of default one
import * as Bluebird from 'bluebird';
global.Promise = <any>Bluebird.default.Promise

exports = module.exports = require('./app');
