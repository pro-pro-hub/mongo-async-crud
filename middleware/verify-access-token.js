const jwt = require("jsonwebtoken");
const { toCamelCase } = require("../modules/format-case");
require("dotenv").config();

const verifyAcessToken = (req, res, next) => {
  const accessToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!accessToken)
    return res.status(401).json({
      error: "No access token provided",
    });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const reason = err.name.toLowerCase().includes("expired")
        ? "Expired"
        : "Invalid";
      return res.status(401).json({
        error: `${reason} access token`,
      });
    }
    req.user = toCamelCase(decoded.user);
    next();
  });
};

module.exports = verifyAcessToken;
