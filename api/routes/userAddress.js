const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const UserAddress = require("../models/userAddress");

// Thêm địa chỉ mới cho người dùng
router.post("/:userId/create", async (req, res) => {
  try {
    const { address } = req.body;
    const newAddress = new UserAddress({
      _id: new mongoose.Types.ObjectId(),
      address,
      user: req.params.userId,
    });
    const savedAddress = await newAddress.save();
    const user = await User.findByIdAndUpdate(req.params.userId, { $push: { addresses: savedAddress._id } });
    res.status(201).json({ message: "Create new address successfully", data: savedAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Lấy toàn bộ địa chỉ người dùng
router.get("/:userId", async (req, res) => {
  try {
    const userAddresses = await UserAddress.find({ user: req.params.userId });
    res.status(200).json({ data: userAddresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Cập nhật thông tin địa chỉ của người dùng dựa trên ID
router.put("/:userId/:id", async (req, res) => {
  try {
    const { address } = req.body;
    const updatedAddress = await UserAddress.findOneAndUpdate(
      { _id: req.params.id, user: req.params.userId },
      { address },
      { new: true }
    );
    if (updatedAddress) {
      res.status(200).json({ message: "Updated address successfully", data: updatedAddress });
    } else {
      res.status(404).json({ message: "No address found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa địa chỉ của người dùng dựa trên ID
router.delete("/:userId/:id", async (req, res) => {
  try {
    const deletedAddress = await UserAddress.findOneAndRemove({ _id: req.params.id, user: req.params.userId });
    if (deletedAddress) {
      await User.findByIdAndUpdate(req.params.userId, { $pull: { addresses: deletedAddress._id } });
      res.status(200).json({ message: "Deleted address successfully", data: deletedAddress });
    } else {
      res.status(404).json({ message: "No address found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
