const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(500).json({
          message: "Email Already Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: "Something went wrong",
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hash,
              phone: req.body.phone,
              createdAt: new Date().toISOString(),
            });

            user
              .save()
              .then((doc) => {
                res.status(201).json({
                  message: "Account Created Successfully",
                });
              })
              .catch((er) => {
                res.status(500).json({
                  error: er,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Login Failed",
            });
          } else {
            if (result) {
              res.status(200).json({
                message: "Login successfully",
                user: user,
              });
            } else {
              res.status(401).json({
                message: "Incorrect password",
              });
            }
          }
        });
      } else {
        res.status(500).json({
          message: "Email doesn't not exists",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.put("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};

  if (!req.body.currentPassword) {
    return res.status(400).json({ error: "Current password is required" });
  }

  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(req.body.currentPassword, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }

        if (!result) {
          return res.status(401).json({ message: "Incorrect password" });
        }

        for (const key of Object.keys(req.body)) {
          if (key !== "currentPassword" && key !== "username") {
            updateOps[key] = req.body[key];
          }
        }

        if (req.body.newPassword) {
          bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err });
            }
            updateOps.password = hash;

            User.updateOne({ _id: id }, { $set: updateOps })
              .exec()
              .then((result) => {
                res.status(200).json({
                  message: "User updated",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  error: error,
                });
              });
          });
        } else {
          // Update user in database
          User.updateOne({ _id: id }, { $set: updateOps })
            .exec()
            .then((result) => {
              res.status(200).json({
                message: "User updated",
              });
            })
            .catch((error) => {
              res.status(500).json({
                error: error,
              });
            });
        }
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
