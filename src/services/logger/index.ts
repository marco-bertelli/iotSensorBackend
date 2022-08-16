import * as winston from 'winston';
import * as winstonExpress from 'express-winston';
import * as _ from 'lodash';

interface Logger extends winston.Logger {
  _loggerError?: any
}

const format = winston.format;

const logger: Logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.colorize(),
        format.colorize(),
        format.metadata(),
        format.printf((info) => {
          return `${info.metadata.timestamp} ${info.level}:${info.metadata.section ? ` ${info.metadata.section}` : ''} ${_.isString(info.message) ? info.message : JSON.stringify(info.message)
            }. ${info.metadata.stack ? '\n' + info.metadata.stack : ''}`;
        })
      )
    })
  ]
})

logger._loggerError = logger.error;

logger.error = (err) => {
  if (err instanceof Error) {
    return logger._loggerError(JSON.stringify(err.message), err);
  } else {
    return logger._loggerError(err);
  }
};

export const expressLogger = winstonExpress.logger({
  winstonInstance: logger, // TODO: log errors explicitly
  msg:
    '{{req.method}} {{res.statusCode}} {{res.responseTime}}ms user:{{req.user?req.user._id:"Anonymous"}} {{req.url.split("?")[0]}}',
  colorize: true
});

export const expressErrorLogger = winstonExpress.errorLogger({
  winstonInstance: logger, // TODO: log errors explicitly
  msg:
    '{{req.method}} {{res.statusCode}} {{res.responseTime}}ms user:{{req.user?req.user._id:"Anonymous"}} {{req.url.split("?")[0]}} body:{{JSON.stringify(req.body)}}',
  meta: false
});

export default logger;
