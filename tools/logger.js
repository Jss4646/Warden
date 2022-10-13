const { createLogger, transports, format } = require("winston");

const { combine, colorize, simple } = format;

/**
 * https://github.com/winstonjs/winston
 *
 * @type {winston.Logger}
 */
const logger = new createLogger({
  level: "info",
  transports: [
    new transports.Console({ format: combine(colorize(), simple()) }),
    new transports.File({
      level: "debug",
      filename: "client/build/debug.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 20,
      colorize: false,
    }),
  ],
});

module.exports = logger;
