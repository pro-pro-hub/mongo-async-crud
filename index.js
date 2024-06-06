const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./modules/log-event").config();
const customCors = require("./middleware/custom-cors");
const { logger, errorLogger } = require("./middleware/logger");
const verifyAcessToken = require("./middleware/verify-access-token");
const connectMongo = require("./modules/connect-mongo");

const app = express();

// Custom middleware
app.use(logger);

// Third party middleware
app.use(customCors);

// Built in middleware
// For url encoded data ie form data
app.use(express.urlencoded({ extended: true }));

// For parsing json data
app.use(express.json());

// For parsing the body with text data
app.use(express.text());

// For parsing cookies
app.use(cookieParser());

// Using a router for an api
app.use("/api/employees", verifyAcessToken, require("./routes/api/employees"));
app.use("/api/users", verifyAcessToken, require("./routes/api/users"));

// Using a router for authorization
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// For serving static files
//app.use(express.static(rootDir.root));

// Making a router for the root
app.use(require("./routes/root"));

const rootDir = { root: path.join(__dirname, "views") };

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) res.sendFile("404.html", rootDir);
  else if (req.accepts("json")) res.json({ message: "404 Not Found" });
  else res.type("txt").send("404 Not Found");
});

app.use(errorLogger);

const PORT = process.env.PORT || 80;

// Connect Mongo
try {
  const mongoose = connectMongo();
  mongoose.connection.once("open", () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
} catch (err) {
  console.log(err);
}
