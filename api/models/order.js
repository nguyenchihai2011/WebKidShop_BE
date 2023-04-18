const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order: [
    {
      cart: { type: mongoose.Schema.Types.ObjectId, ref: "CartItem" },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    },
  ],
  note: String ,
  paymentType:  { type: String, enum: ["COD", "Paypal"] },
  orderDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Order", orderSchema);
