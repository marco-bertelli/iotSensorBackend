/* eslint-disable no-unused-vars */
import path from 'path';
import { merge } from 'lodash';

/* istanbul ignore next */
const requireProcessEnv = (name: string) => {
	if (!process.env[name]) {
		throw new Error('You must set the ' + name + ' environment variable');
	}
	return process.env[name];
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv-safe');
	dotenv.load({
		path: path.join(__dirname, '../.env'),
		sample: path.join(__dirname, '../.env.example')
	});
}

const APP_NAME = requireProcessEnv('APP_NAME');

const config: any = {
	all: {
		appName: APP_NAME,
		env: process.env.NODE_ENV || 'development',
		root: path.join(__dirname, '..'),
		port: process.env.PORT || 9000,
		ip: process.env.IP || '0.0.0.0',
		expressSSLRedirect: false,
		masterKey: requireProcessEnv('MASTER_KEY'),
		jwtSecret: requireProcessEnv('JWT_SECRET'),
		secretMasterName: requireProcessEnv('SECRET_MASTER_NAME'),
		secretMasterUrl: requireProcessEnv('SECRET_MASTER_URL'),
		host: requireProcessEnv('HOST'),
		disableScheduler: !!process.env.DISABLE_SCHEDULER || false,

		// redis
		redisUrl: requireProcessEnv('REDIS_URL'),
		redisUsername: requireProcessEnv('REDIS_USERNAME'),
		redisPwd: requireProcessEnv('REDIS_PWD'),
	},
	test: {
		mongo: {
			uri: `mongodb://localhost/${APP_NAME}-test`,
			options: {
				debug: false
			}
		}
	},
	development: {
		mongo: {
			uri: process.env.MONGODB_URI || `mongodb://localhost/${APP_NAME}-dev`,
			options: {
				debug: true,
			}
		}
	},
	production: {
		ip: process.env.IP || '0.0.0.0',
		port: process.env.PORT || 8080,
		expressSSLRedirect: process.env.DISABLE_SSL_REDIRECT !== 'true',
		mongo: {
			uri: process.env.MONGODB_URI || `mongodb://localhost/${APP_NAME}`,
			options: {
				debug: false
			}
		}
	}
};

const mergedConfig: any = merge(config.all, config[config.all.env]);

export default mergedConfig
