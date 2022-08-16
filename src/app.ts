import http from 'http';
import logger from './services/logger/index';
import api from './api/index';
import Config from './config';
import express from './services/express/index';
import mongoose from './services/mongoose/index';

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


setImmediate(() => {
	server.listen(port, ip, () => {
		logger.info(
			`Express server listening on http://${ip}:${port}, in ${env} mode`
		);
	});
});

export default app;
