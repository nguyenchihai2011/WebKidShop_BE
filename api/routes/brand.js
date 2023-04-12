const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Brand = require("../models/brand");

router.get("/", (req, res) => {
  Brand.find()
    .then((brand) => res.json(brand))
    .catch((err) => {
      res.status(404).json({ NoBrandsFound: "No Brands found" });
    });
});

router.get("/:id", (req, res) => {
  Brand.findById(req.params.id)
    .then((brand) => res.json(brand))
    .catch((err) => {
      res.status(404).json({ NoBrandsFound: "No brands found" });
    });
});

router.post("/", (req, res) => {
  const brand = new Brand({
    _id: mongoose.Types.ObjectId(),
    logo: req.body.logo,
    name: req.body.name,
    description: req.body.description,
  });
  return brand
    .save()
    .then((brand) => res.json({ msg: "Brand added successfully" }))
    .catch((err) => {
      res.status(404).json({ error: "Unable to add this brand" });
    });
});

router.put("/:id", (req, res) => {
  Brand.findByIdAndUpdate(req.params.id, req.body)
    .then((brand) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

router.delete("/:id", (req, res) => {
  Brand.findByIdAndRemove(req.params.id, req.body)
    .then((brand) => res.json({ mgs: "Brand entry deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "No such a brand" }));
});

module.exports = router;
