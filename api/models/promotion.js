const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  startDay: {
    type: Date,
    require: true,
  },
  endDay: {
    type: Date,
    require: true,
  },
  discount: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Promotion", promotionSchema);
