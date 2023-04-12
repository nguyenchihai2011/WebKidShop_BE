const express = require("express");
const mongoose = require("mongoose");
const Brand = require("../models/brand");
const router = express.Router();

// Tìm kiếm một Brand bằng điều kiện query
router.get("/", async (req, res) => {
  try {
    const { logo, name, description } = req.query;
    const query = {};
    if (logo) query.logo = logo;
    if (name) query.name = name;
    if (description) query.description = description;
    const brands = await Brand.findOne(query);
    if (!brands) {
      return res.status(404).json({ message: "Can not find Brand" });
    }
    res.json({ message: "Found the brand", data: brands });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tìm kiếm một Brand bằng ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Can not find Brand" });
    }
    res.json({ message: "Found the brand in database", data: brand });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm một Brand mới
router.post("/", async (req, res) => {
  const { logo, name, description } = req.body;
  try {
    const brand = new Brand({
      _id: new mongoose.Types.ObjectId(),
      logo,
      name,
      description,
    });
    await brand.save();
    res.status(201).json({message: 'Create brand successfully', data:brand});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin một Brand
router.patch("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Can not find Brand" });
    }
    const { logo, name, description } = req.body;
    if (logo) brand.logo = logo;
    if (name) brand.name = name;
    if (description) brand.description = description;
    await brand.save();
    res.json({message: 'Update brand successfully', data:brand});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa một Brand
router.delete("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Can not find Brand" });
    }
    await brand.remove();
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
