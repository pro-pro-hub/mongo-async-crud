const cors = require("cors");

// Create a cors option object
const { ALLOWED_ORIGINS } = require("../config/config.json");
/* const option = {
  origin: (origin, cb) => {
    if (allowedOrigins.includes(origin) || !origin) cb(null, true);
    else cb(new Error("Not allowed by cors"));
  },
  optionsSuccessStatus: 200,
}; */

module.exports = cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
});
