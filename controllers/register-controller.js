const bycrypt = require("bcrypt");
const { toCamelCase, toUnderScore } = require("../modules/format-case");
const { setRoles, getUserRoleCode } = require("../modules/user-roles");
const User = require("../model/User");

const handleNewUser = async (req, res) => {
  try {
    const { userName, password, roles } = toCamelCase(req.body);
    // Check if there's a userName and password
    if (!userName || !password)
      return res.status(400).json({
        message: "Username, password and roles are required",
      });
    // Check if username has been taken
    const userNameExists = await User.findOne(
      toUnderScore({ userName })
    ).lean();
    if (userNameExists)
      return res.status(409).json({
        message: `Username ${userName} has been taken`,
      });
    // Create roles list
    const userRoles = getUserRoleCode(setRoles(roles));
    // Create a hash for the password
    const hashedPassword = await bycrypt.hash(password, 10);
    // Create a new user
    const newUserObj = toUnderScore({
      userName,
      password: hashedPassword,
      roles: userRoles,
    });
    const newUser = toCamelCase((await User.create(newUserObj)).toObject());
    console.log(newUser);
    res.status(201).json({
      message: `New user: ${newUser.userName} created!`,
      id: newUser._id,
    });
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = handleNewUser;
