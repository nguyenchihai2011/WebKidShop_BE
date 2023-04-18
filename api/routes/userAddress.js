const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserAddress = require("../models/userAddress");

//Thêm địa chỉ mới cho người dùng
router.post("/create", async (req, res) => {
  try {
    const { address } = req.body;
    const newAddress = new UserAddress({
      _id: new mongoose.Types.ObjectId(),
      address: address,
    });
    const savedAddress = await newAddress.save();
    res.status(201).json({ message: "Create new address successfully", data: savedAddress });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//Lấy thông tin địa chỉ của người dùng dựa trên ID
router.get("/:id", async (req, res) => {
  try {
    const address = await UserAddress.findById(req.params.id);
    if (address) {
      res.status(200).json({ data: address });
    } else {
      res.status(404).json({ message: "No Address found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//Cập nhật thông tin địa chỉ của người dùng dựa trên ID
router.put("/:id", async (req, res) => {
  try {
    const { address } = req.body;
    const updatedAddress = await UserAddress.findByIdAndUpdate(
      req.params.id,
      { address: address },
      { new: true }
    );
    if (updatedAddress) {
      res.status(200).json({ message: "Updated address successfully", data: updatedAddress });
    } else {
      res.status(404).json({ message: "No addess found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//Xóa địa chỉ của người dùng dựa trên ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAddress = await UserAddress.findByIdAndRemove(req.params.id);
    if (deletedAddress) {
      res.status(200).json({ message: "Deleted address successfully", data: deletedAddress });
    } else {
      res.status(404).json({ message: "No addess found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
