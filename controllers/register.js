const User = require("../model/User"); // model
const bcrypt = require("bcrypt");

const registerController = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // check user & password is required
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username or password is required" });

  // check duplicate
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409); // conflict

  // write into usersDB
  try {
    const hashpwd = await bcrypt.hash(password, 10);
    // create & store the new user
    const result = await User.create({
      username,
      password: hashpwd,
    });
    console.log("result", result);
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = registerController;
