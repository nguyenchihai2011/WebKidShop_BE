const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Promotion = require("../models/promotion");

router.get("/", (req, res) => {
  Promotion.find()
    .then((promotion) => res.json(promotion))
    .catch((err) =>
      res.status(404).json({ NoPromotionsFound: "No promotions found" })
    );
});

router.get("/:id", (req, res) => {
  Promotion.findById(req.params.id)
    .then((promotion) => res.json(promotion))
    .catch((err) =>
      res.status(404).json({ NoPromotionsFound: "No promotions found" })
    );
});

router.post("/", (req, res) => {
  const promotion = new Promotion({
    _id: new mongoose.Types.ObjectId(),
    startDay: req.body.startDay,
    endDay: req.body.endDay,
    discount: req.body.discount,
  });
  return promotion
    .save()
    .then((promotion) => res.json({ msg: "Promotion added successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this promotion" })
    );
});

router.put("/:id", (req, res) => {
  Promotion.findByIdAndUpdate(req.params.id, req.body)
    .then((promotion) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

router.delete("/:id", (req, res) => {
  Promotion.findByIdAndRemove(req.params.id, req.body)
    .then((promotion) =>
      res.json({ mgs: "Promotion entry deleted successfully" })
    )
    .catch((err) => res.status(404).json({ error: "No such a category" }));
});

module.exports = router;
