const mongoose = require("mongoose");

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = mongoose.model("LogInCollection", LogInSchema);

module.exports = collection;
