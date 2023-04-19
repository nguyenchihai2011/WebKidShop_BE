const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }, 
    },
  ],
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  note: String,
  totalPrice: { type: Number, required: true },
  paymentType: { type: String, enum: ["COD", "Paypal"] },
  status: { type: String, enum: ["Pending", "Confirmed", "Delivered"] },
  orderDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Order", orderSchema);
