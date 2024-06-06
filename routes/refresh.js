const express = require("express");
const handleRefreshToken = require("../controllers/refresh-controller");
const router = express.Router();

router.get("/", handleRefreshToken);

module.exports = router;
