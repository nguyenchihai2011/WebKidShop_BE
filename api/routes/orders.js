const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const paypal = require("paypal-rest-sdk");
const Order = require("../models/order");
const CartItem = require("../models/cartItem");
const Product = require("../models/product");

// Cấu hình Paypal API
paypal.configure({
  mode: "sandbox", // Chế độ hoạt động của Paypal API (sandbox hoặc live)
  client_id:
    "AQ0oPx58pxQxGQjX34ne0kUHcyvlHDe5-1oPAjRs3o15bxkwOPDO6_Q_MLkxU8P-8vO4cXZLFw2t9bJn", // Mã client ID của Paypal API
  client_secret:
    "EKqo7_28R9DA-RV5uSTGlxgjG4xW67N7SLdClUWa7IhE7sr5vd9vlWvsNqwG4eZkxwWRO_k2f13VsMP1", // Mã client secret của Paypal API
});

// Route để thanh toán giỏ hàng
router.post("/", async (req, res) => {
  const { user, order, note, paymentType, address } = req.body;
  if (Array.isArray(order)) {
    const orderItems = await Promise.all(
      order.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: product._id,
          name: product.name,
          brand: product.brand,
          size: product.size,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user,
      order: orderItems,
      address,
      note,
      status: "Pending",
      paymentType,
    });

    // Save the order to the database
    await newOrder.save();
    const productIds = orderItems.map((item) => item.product);
    await CartItem.deleteMany({
      user: user,
      product: { $in: productIds },
    });
    return res.status(201).json({
      success: true,
      message: "Checkout successfully",
      order: newOrder,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid order format",
    });
  }
});

/*
API cập nhật trạng thái đơn hàng
    {
      "status": "Confirm"
    }
    {
      "status": "Cancel"
    }
    {
      "status": "Delivered"
    }
*/

// Route để cập nhật status cho đơn hàng
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    // Kiểm tra đơn hàng có tồn tại hay không
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Cập nhật status cho đơn hàng
    order.status = status;

    // Nếu trạng thái đơn hàng là "Reject", hủy Checkout và chuyển trạng thái thành "Reject"
    if (status === "Reject") {
      order.checkout = false;
    }

    await order.save();

    // Giảm số lượng sản phẩm trong giỏ hàng và giảm stock của product
    if (status === "Delivered") {
      const orderItems = order.order;
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          if (product.stock === 0) {
            return res.status(400).json({
              success: false,
              message: "Not enough product in stock",
            });
          }
          product.stock -= item.quantity;
          await product.save();

          const cartItem = await CartItem.findOne({ product: item.product });
          if (cartItem) {
            cartItem.quantity -= item.quantity;
            if (cartItem.quantity <= 0) {
              await cartItem.remove();
            } else {
              await cartItem.save();
            }
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error.message,
    });
  }
});


// Route để lấy tất cả đơn hàng
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "email").exec();
    return res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something wrong please try again",
      error: error.message,
    });
  }
});

//Route lấy giỏ hàng theo userID
router.get("/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      throw new Error("Invalid user ID");
    }

    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const orders = await Order.find({ user: userId });
    return res.status(200).json({
      success: true,
      orders: orders,
    });
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
