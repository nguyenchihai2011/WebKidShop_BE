const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paypal = require("paypal-rest-sdk");
const Order = require("../models/order");
const CartItem = require("../models/cartItem");

// Cấu hình Paypal API
paypal.configure({
  mode: "sandbox", // Chế độ hoạt động của Paypal API (sandbox hoặc live)
  client_id:
    "AQ0oPx58pxQxGQjX34ne0kUHcyvlHDe5-1oPAjRs3o15bxkwOPDO6_Q_MLkxU8P-8vO4cXZLFw2t9bJn", // Mã client ID của Paypal API
  client_secret:
    "EKqo7_28R9DA-RV5uSTGlxgjG4xW67N7SLdClUWa7IhE7sr5vd9vlWvsNqwG4eZkxwWRO_k2f13VsMP1", // Mã client secret của Paypal API
});

router.post("/", async (req, res) => {
  try {
    const { user, products, note, paymentType } = req.body;

    // Tính tổng tiền
    const totalPrice = products.reduce(
      (total, { price, quantity }) => total + price * quantity,
      0
    );

    if (paymentType === "Paypal") {
      // Xử lý phương thức thanh toán Paypal
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success", // URL khi thanh toán thành công
          cancel_url: "http://localhost:3000/cancel", // URL khi hủy thanh toán
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Order", // Tên đơn hàng
                  sku: "order", // SKU của đơn hàng
                  price: totalPrice, // Giá đơn hàng
                  currency: "USD", // Đơn vị tiền tệ
                  quantity: 1, // Số lượng
                },
              ],
            },
            amount: {
              currency: "USD", // Đơn vị tiền tệ
              total: totalPrice, // Tổng tiền của đơn hàng
            },
            description: "Order payment", // Mô tả đơn hàng
          },
        ],
      };

      // Tạo đơn hàng trên Paypal
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          // Redirect đến trang thanh toán của Paypal
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              return res.redirect(payment.links[i].href);
            }
          }
        }
      });
    } else if (paymentType === "COD") {
      const newOrder = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        order: products.map((p) => ({
          product: p.product,
          quantity: p.quantity,
        })),
        address: address,
        note: note,
        status: "Pending",
        totalPrice: totalPrice,
      });

      // Lưu đơn hàng vào cơ sở dữ liệu
      await newOrder.save();
      return res.status(201).json({
        success: true,
        message: "Checkout successfully",
        order: newOrder,
      });
    } else {
      // Xử lý phương thức thanh toán không hợp lệ
      return res.status(400).json({
        success: false,
        message: "Invalid payment type",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something wrong please try again",
      error: error.message,
    });
  }
});

module.exports = router;
