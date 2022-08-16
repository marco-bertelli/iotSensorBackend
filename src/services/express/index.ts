import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import logger, {expressLogger } from '../logger';

// manual import for modules that don't have TS support
const forceSSL = require('express-force-ssl');
const { errorHandler } = require('querymen');
const bodyErrorHandler = require('bodymen').errorHandler;

import Config from '../../config';

const { env, expressSSLRedirect } = Config;

export default (routes: any) => {
	const app = express();

	/* istanbul ignore next */
	if (env === 'production' && expressSSLRedirect) {
    logger.info('\x1B[0;34mExpress:\x1B[0m SSL redirect is ENABLED');
		app.set('forceSSLOptions', {
			enable301Redirects: false,
			trustXFPHeader: true
		});
		app.use(forceSSL);
	} else {
    logger.info('\x1B[0;34mExpress:\x1B[0m SSL redirect is DISABLED');
  }

	/* istanbul ignore next */
	if (env === 'production' || env === 'development') {
		app.use(cors());
		app.use(compression());
		app.use(expressLogger);
	}

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(routes);
	app.use(errorHandler());
	app.use(bodyErrorHandler());

	return app;
};
