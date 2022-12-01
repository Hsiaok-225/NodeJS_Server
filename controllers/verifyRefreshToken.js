const User = require("../model/User");
const jwt = require("jsonwebtoken");

// Client: loggined(got rfToken) & ask for new accessToken
// send req with cookie-rfToken to Server

// Server
// 0. check cookies
// 1. get user from DB and response new accessToken to user
// 2. update refreshToken expire time?

const VerifyRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // compare User & refreshToken
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser)
    return res
      .status(401)
      .json({ message: "Not found user with refreshToken" }); // Unauthorized

  // Verify refreshToken
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err || foundUser.username !== decode.username)
      return res.status(403).json({ message: err });

    //decode from refreshToken & send newAccessToken to user
    const roles = Object.values(foundUser.roles);
    const newAccessToken = jwt.sign(
      {
        UserInfo: {
          username: decode.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.status(201).json({ accessToken: newAccessToken });
  });
};

module.exports = VerifyRefreshToken;
