// allowRoles receive series of numbers
const verifyRoles = (...allowRoles) => {
  return (req, res, next) => {
    // check one of roles in allowlist
    const roles = req.roles; // array
    const allowlist = [...allowRoles];
    console.log("user", roles);
    console.log("allowlist", allowlist);
    // includes return true|false
    const isValid = roles
      .map((role) => allowlist.includes(role))
      .find((element) => element === true);
    if (!isValid)
      return res.status(401).json({ message: "user not have authorization" });
    next();
  };
};

module.exports = verifyRoles;

// origin
// 1. login to get auth(JWTtoken)
// 2. set header: bearer token to employee-api
// 3. check isVerify -> use employee-api

// update
// add VerifyRoles miidleware

// 2. set header: bearer token to employee-api
// 3. set req.roles = jwt.decode.roles
// 4. isVerify -> verifyRoles
// 5.
