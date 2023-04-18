const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const Brand = require("../models/brand");

// Route để tạo mới sản phẩm
router.post("/create", async (req, res) => {
  try {
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để lấy thông tin chi tiết của một sản phẩm dựa trên ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để cập nhật thông tin của một sản phẩm dựa trên ID
router.put("/:productId", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để xóa một sản phẩm dựa trên ID
router.delete("/:productId", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
