const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  address: { type: String, required: true },
});

module.exports = mongoose.model("Address", addressSchema);
