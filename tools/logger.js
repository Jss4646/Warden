const { createLogger, transports, format } = require("winston");

const { combine, colorize, simple } = format;

const logger = new createLogger({
  level: "debug",
  transports: [
    new transports.Console({ format: combine(colorize(), simple()) }),
    new transports.File({
      level: "info",
      filename: `client/build/info.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 20,
      colorize: false,
    }),
  ],
});

module.exports = logger;
