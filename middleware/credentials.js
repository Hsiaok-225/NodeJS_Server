const allowOrigins = require("../config/allowedOrigins");

// Setting "Access-Control-Allow-Credentials" to receive frontend cookies(which is differnt with Origin)
// if (allowOrigin has origin) then set Access-Control-Allow-Credentials
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
