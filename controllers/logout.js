const User = require("../model/User");

// Client: delete accessToken
// Server: clear user refreshToken & cookies

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(202).json({ message: "No content" });
  const refreshToken = cookies.jwt;

  // check refreshToken in DB
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(202).json({ message: "Not foundUser" });
  }

  // delete user's refreshToken from DB
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ message: `logout sucess` });
};

module.exports = logout;
