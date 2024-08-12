const express = require("express");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");

router.post("/sell/:userId", async (req, res) => {
  try {
    const {sellerId} = req.params;
    const {
      name,
      variety,
      harvestDate,
      quantity,
      unit,
      pricePerUnit,
      location,
    } = req.body;

    const crop = new Crop({
      name,
      variety,
      harvestDate,
      quantity,
      unit,
      pricePerUnit,
      sellerId,
      location,
    });

    await crop.save();
    res.status(201).json({ message: "Crop added successfully", crop });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error - Crops couldn't be added" });
  }
});

module.exports = router;
