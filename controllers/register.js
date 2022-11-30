const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const registerController = async (req, res) => {
  const { username, password } = req.body;
  // check user & password is required
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username or password is required" });

  // check duplicate
  const duplicate = usersDB.users.find((user) => user.username === username);
  if (duplicate) return res.sendStatus(409); // conflict

  // write into usersDB
  try {
    // hash password
    const hashpwd = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      roles: { User: 3000 },
      password: hashpwd,
    };
    // add to users
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = registerController;
