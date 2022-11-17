const { createLogger, transports, format } = require("winston");

const { combine, colorize, simple } = format;

const debuggingLevel = process.env.LOGGING_LEVEL || "info";

/**
 * https://github.com/winstonjs/winston
 *
 * @type {winston.Logger}
 */
const logger = new createLogger({
  level: debuggingLevel,
  transports: [
    new transports.Console({ format: combine(colorize(), simple()) }),
    new transports.File({
      level: debuggingLevel,
      filename: "client/build/debug.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 20,
      colorize: false,
    }),
  ],
});

logger.log("info", `Logging level set to: ${debuggingLevel}`);


module.exports = logger;
