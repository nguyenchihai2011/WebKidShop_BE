const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  logo: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
