const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  stockNum: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Stock", stockSchema);
