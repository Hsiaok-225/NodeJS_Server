const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username or password is required" });

  //Check user exist
  const foundUser = await User.findOne({ username }).exec();
  console.log(foundUser);
  if (!foundUser)
    return res.status(401).json({ message: `Unauthorized, user is not exist` });

  // Verify password
  // set jwt to user & refreshToken to db
  try {
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) return res.status(401).json({ message: `wrong password` });

    // jwt & refresh
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120s" }
    );
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Update user with refreshToken in DB
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log("auth", result);

    // Set refresh & jwt to user
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = authController;
