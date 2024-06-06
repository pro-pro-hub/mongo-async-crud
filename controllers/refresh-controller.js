const jwt = require("jsonwebtoken");
const { toCamelCase, toUnderScore } = require("../modules/format-case");
const User = require("../model/User");

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.token;
    // Check for refresh token
    if (!refreshToken)
      return res.status(401).json({
        error: "No refresh token",
      });
    // Check refresh token in db
    const foundUser = toCamelCase(
      await User.findOne(toUnderScore({ refreshToken })).lean()
    );
    if (!foundUser) {
      // Clear the refresh token on client
      res.clearCookie("token", {
        httpOnly: true,
        // sameSite: "lax",

        // For cors
        sameSite: "none",
        secure: true,
      });
      return res.status(401).json({
        error: "Deleted refresh token",
      });
    }
    // Validate refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || toCamelCase(decoded).userName !== foundUser.userName) {
          res.status(403);
          const reason = err.name.toLowerCase().includes("expired")
            ? "Expired"
            : "Invalid";
          res.json({
            error: `${reason} refresh token`,
          });
        }
        // Generate a new acess token
        const accessToken = jwt.sign(
          {
            user: toUnderScore({
              userName: foundUser.userName,
              roles: foundUser.roles,
              refreshed: true,
            }),
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10m",
          }
        );
        // Send the access token as json
        res.status(200).json(
          toUnderScore({
            accessToken,
          })
        );
      }
    );
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = handleRefreshToken;
