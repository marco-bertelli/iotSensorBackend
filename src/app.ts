import http from 'http';
import logger from './services/logger/index';
import api from './api/index';
import Config from './config';
import express from './services/express/index';
import mongoose from './services/mongoose/index';

import { initDevice } from './services/iot/index';
import { checkMasterCertificate } from './services/iot/certManager';
import { initDatalogRepo, initRedis } from './services/redis';

const {
	env,
	ip,
	port,
	mongo,
} = Config;

const app = express(api);
const server = http.createServer(app);

mongoose.connect(
	mongo.uri,
	{
		maxIdleTimeMS: 10000,
		keepAlive: false,
	}
);

setImmediate(async () => {

	await initRedis();
	await initDatalogRepo();

	// local machine cert handler
	await checkMasterCertificate();

	server.listen(port, ip, () => {
		logger.info(
			`Express server listening on http://${ip}:${port}, in ${env} mode`
		);
	});

	// init aws iot
	initDevice();
});

export default app;
