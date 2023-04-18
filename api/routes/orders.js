const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paypal = require("paypal-rest-sdk");
const Order = require("../models/order");
const CartItem = require("../models/cartItem");

// Cấu hình Paypal API
paypal.configure({
  mode: "sandbox", // Chế độ hoạt động của Paypal API (sandbox hoặc live)
  client_id: "AVu38JPdwRB2w5UUPcqEs5hs7IBagyIXfMiPNeXVqPcty6TJ5JVf3GMjwENnFpU5yM7AeZVky6D2seBK", // Mã client ID của Paypal API
  client_secret: "ENBAkqiwu1p2cnI7b1Wu9QsakX3XGHcsagsxfMWlXnKqQaE7uhJ3bBAdYjegP4F2NUcJvRrKtFvRiVq6", // Mã client secret của Paypal API
});

// Route để thanh toán giỏ hàng
router.post("/", async (req, res) => {
  try {
    const { user, order, note, paymentType } = req.body;

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
                  price: order.totalPrice, // Giá đơn hàng
                  currency: "USD", // Đơn vị tiền tệ
                  quantity: 1, // Số lượng
                },
              ],
            },
            amount: {
              currency: "USD", // Đơn vị tiền tệ
              total: order.totalPrice, // Tổng tiền của đơn hàng
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
        user,
        order,
        note,
        paymentType,
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
