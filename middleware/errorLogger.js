const { logEvents } = require("./logEvents");

const errorLogger = (err, req, res, next) => {
  logEvents(`${err}`, "errLog.txt");
  next();
};

module.exports = errorLogger;
