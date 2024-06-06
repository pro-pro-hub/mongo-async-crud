const logger = (req, res, next) => {
  process.logEvent(
    `${req.method}\t${req.headers.origin}\t${req.url}`,
    "req_log.txt"
  );
  next();
};

const errorLogger = (err, req, res, next) => {
  console.log(err);
  process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
  res.status(500).send(err.message);
  next();
};

module.exports = { logger, errorLogger };
