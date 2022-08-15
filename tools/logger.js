const { createLogger, transports, format } = require("winston");

const { combine, colorize, simple } = format;

const logger = new createLogger({
  level: "debug",
  transports: [new transports.Console()],
  format: combine(colorize(), simple()),
});

module.exports = logger;
