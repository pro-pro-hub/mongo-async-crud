const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { toCamelCase, toUnderScore } = require("../modules/format-case");
const User = require("../model/User");

const handleLogin = async (req, res) => {
  try {
    const { userName, password } = toCamelCase(req.body);
    // Check if userName and password exists
    if (!userName || !password)
      return res.status(400).json({
        message: "Username and password are required",
      });
    // Check if the userName exists in the DB
    const foundUser = await User.findOne(toUnderScore({ userName }));
    if (!foundUser)
      return res.status(401).json({
        message: `Username: ${userName} not found!`,
      });
    const userObj = toCamelCase(foundUser.toObject());
    // Evaluate the password
    const match = await bycrypt.compare(password, userObj.password);
    if (!match)
      return res.status(401).json({
        message: "Incorrect password!",
      });
    // Create JWTs
    // Access token
    const accessToken = jwt.sign(
      {
        user: toUnderScore({
          userName: userObj.userName,
          roles: userObj.roles,
          refreshed: false,
        }),
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    // Refresh token
    const refreshToken = jwt.sign(
      toUnderScore({
        userName: userObj.userName,
      }),
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // Store the refresh token in db for referencing
    foundUser[toUnderScore("refreshToken")] = refreshToken;
    const updatedUser = toCamelCase((await foundUser.save()).toObject());
    console.log(updatedUser);
    // Send the refresh token as a cookie
    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: Date.now() + 24 * 60 * 60 * 1000,
      // sameSite: "lax",

      // For cors
      sameSite: "none",

      // For browsers
      // secure: true,
    });
    // Send the access token as json
    res.status(200).json(
      toUnderScore({
        message: `User: ${updatedUser.userName} is logged in`,
        accessToken,
      })
    );
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = handleLogin;
