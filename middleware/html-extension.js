const htmlExtension = (req, res, next) => {
  if (!req.url.endsWith("/") && !require("path").extname(req.url))
    req.url = req.url + ".html";
  next();
};

module.exports = htmlExtension;
