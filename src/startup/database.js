const mongoose = require("mongoose");
const config = require("config");
const dbDebugger = require("debug")("app:db");

module.exports = function() {
  // connect to mongodb
  mongoose
    .connect(config.get("db.url"), {
      useNewUrlParser: config.get("db.useNewUrlParser"),
      useFindAndModify: config.get("db.useFindAndModify"),
      useUnifiedTopology: false
    })
    .then(() => dbDebugger("Database connected successfully."))
    .catch(O_O => dbDebugger("Unable to connect to mongodb.", O_O));
};
