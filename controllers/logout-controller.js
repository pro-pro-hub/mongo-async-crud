const { toCamelCase, toUnderScore } = require("../modules/format-case");
const User = require("../model/User");

const handleLogout = async (req, res) => {
  try {
    // On client also delete the access token
    const refreshToken = req.cookies?.token;
    // Check for token
    if (!refreshToken)
      return res.status(200).json({
        success: "Not logged in",
      });
    // Clear the token on client
    res.clearCookie("token", {
      httpOnly: true,
      // sameSite: "lax",

      // For cors
      sameSite: "none",
      secure: true,
    });
    // Check refresh token in db
    const foundUser = await User.findOne(toUnderScore({ refreshToken }));
    if (!foundUser) {
      return res.status(200).json({
        success: "Already logged out",
      });
    }
    // Remove the refresh token in db
    foundUser[toUnderScore("refreshToken")] = "";
    const loggedOutUser = toCamelCase((await foundUser.save()).toObject());
    console.log(loggedOutUser);
    // Send a sucess status
    res.status(200).json({
      success: "Logout succesful",
    });
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = handleLogout;
