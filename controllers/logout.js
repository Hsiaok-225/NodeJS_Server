const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

// Client:
// delete accessToken

// Server:
// clear user refreshToken & cookies
// need to compare with DB ? or just delete

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json({ message: "No content" });
  const refreshToken = cookies.jwt;

  // Is refreshToken in DB?
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(204).json({ message: "Not foundUser" });
  }

  // delete user's refreshToken from DB-> set rT = '' ?
  const currentUser = { ...foundUser, refreshToken: "" };
  const updateUsers = usersDB.users.map((user) => {
    if (user.refreshToken === foundUser.refreshToken) return currentUser;
    return user;
  });

  usersDB.setUsers(updateUsers);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ message: `logout sucess` });
};

module.exports = logout;
