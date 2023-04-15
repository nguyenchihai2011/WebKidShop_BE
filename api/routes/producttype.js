const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Producttype = require("../models/productType");

router.get("/", (req, res) => {
  Producttype.find()
    .then((producttype) => res.json(producttype))
    .catch((err) =>
      res.status(404).json({ noproducttypesfound: "No Producttypes found" })
    );
});

router.get("/:id", (req, res) => {
  Producttype.findById(req.params.id)
    .then((producttype) => res.json(producttype))
    .catch((err) =>
      res.status(404).json({ noproducttypesfound: "No Producttypes found" })
    );
});

router.post("/", (req, res) => {
  const producttype = new Producttype({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
  });
  return producttype
    .save()
    .then((producttype) => res.json({ msg: "Producttype added successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this producttype" })
    );
});

router.put("/:id", (req, res) => {
  Producttype.findByIdAndUpdate(req.params.id, req.body)
    .then((producttype) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

router.delete("/:id", (req, res) => {
  Producttype.findByIdAndRemove(req.params.id, req.body)
    .then((producttype) =>
      res.json({ mgs: "Producttype entry deleted successfully" })
    )
    .catch((err) => res.status(404).json({ error: "No such a producttype" }));
});

module.exports = router;
