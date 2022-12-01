const jwt = require("jsonwebtoken");
require("dotenv").config();

// check accessToken isValid & decode
const verifyJWT = (req, res, next) => {
  // check Headers
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "wrong header" });
  }

  const accessToken = authHeader.split(" ")[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.status(403).json({ message: err }); // Unauthorized
    req.user = decode.UserInfo.username;
    req.roles = decode.UserInfo.roles; // array
    next();
  });
};

module.exports = verifyJWT;
