const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  stockNum: Number,
  name: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Stock", stockSchema);
