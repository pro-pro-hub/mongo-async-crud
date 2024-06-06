const express = require("express");
const path = require("path");
const htmlExtension = require("../middleware/html-extension");
const router = express.Router();

// Make the html extension optional
router.use(htmlExtension);

const rootDir = { root: path.join(__dirname, "..", "views") };

router.get("/404.html", (req, res) => {
  res.status(404).sendFile("404.html", rootDir);
});

router.use(express.static(rootDir.root));

module.exports = router;
