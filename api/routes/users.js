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
              address: req.body.address,
              email: req.body.email,
              password: hash,
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
            if (result){
              res.status(500).json({
                message: "Login successfully",
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

module.exports = router;
