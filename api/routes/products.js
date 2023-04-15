const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const authenticate = require("../middleware/authenticate");

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    size: req.body.size,
    color: req.body.color,
    price: req.body.price,
    stock: req.body.stock,
    description: req.body.description,
    productPic: req.body.productPic,
    arrivalDate: req.body.arrivalDate,
    brand: req.body.brand,
    category: req.body.category,
    productType: req.body.productType,
    promotion: req.body.promotion,
  });

  product
    .save()
    .then((product) => {
      res.status(201).json({
        message: product,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((er) => {
      res.status(500).json({
        error: er,
      });
    });
});

router.get("/:categorySlug", (req, res, next) => {
  let filter = {};
  if (req.query.hasOwnProperty("filter")) {
    filter["price"] = req.query.price;
  }

  const slug = req.params.categorySlug;
  Category.findOne({ slug: slug })
    .select("_id parent")
    .exec()
    .then((category) => {
      if (category) {
        if (category.parent === "") {
          //its a parent category
          //Now find Chidrens
          Category.find({ parent: category._id })
            .select("_id name")
            .exec()
            .then((categories) => {
              const categoriesAr = categories.map((category) => category._id);

              Product.find({ category: { $in: categoriesAr } })
                .select("_id name price productPic category slug")
                .sort(filter)
                .exec()
                .then((products) => {
                  res.status(200).json({
                    message: products,
                  });
                })
                .catch((error) => {
                  res.status(500).json({
                    error: error,
                  });
                });
            })
            .catch((error) => {});
        } else {
          Product.find({ category: category._id })
            .select("_id name price productPic category slug")
            .sort(filter)
            .exec()
            .then((products) => {
              res.status(200).json({
                message: products,
              });
            })
            .catch((error) => {
              return res.status(404).json({
                message: error,
              });
            });
        }
      } else {
        return res.status(404).json({
          message: "Not Found",
        });
      }
    })
    .catch((er) => {
      res.status(500).json({
        error: er,
      });
    });
});

router.get("/:categorySlug/:productSlug", (req, res, next) => {
  const productSlug = req.params.productSlug;

  Product.findOne({ slug: productSlug })
    .exec()
    .then((product) => {
      if (product) {
        res.status(200).json({
          message: product,
        });
      } else {
        return res.status(404).json({
          message: "Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
