const mongoose = require("mongoose");

function connectMongo() {
  mongoose.connect(process.env.DATA_BASE_URI);
  return mongoose;
}

module.exports = connectMongo;
