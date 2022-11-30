const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const authController = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username or password is required" });

  //check user is exist
  const foundUser = usersDB.users.find((user) => user.username === username);
  if (!foundUser)
    return res.status(401).json({ message: `Unauthorized, user is not exist` });

  // verify password(pwd, hashpwd)
  try {
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) return res.status(401).json({ message: `wrong password` });

    // if isValid
    // 1.create accessToken & refreshToken
    // 2.put JWT to userInfo
    // 3.set refreshToken httpOnly

    const roles = Object.values(foundUser.roles); // returns an array [1000,2000]
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "40s" }
    );
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user in DB
    const currentUser = { ...foundUser, refreshToken };
    const updateUsers = usersDB.users.map((user) => {
      if (user.username === foundUser.username) {
        return currentUser;
      }
      return user;
    });

    usersDB.setUsers(updateUsers);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // Set httpOnly cookies with refreshToken
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Send accessToken when user loggin
    res.json({
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = authController;
