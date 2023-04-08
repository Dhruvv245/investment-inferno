const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  leader: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
