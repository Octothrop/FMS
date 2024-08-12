const express = require("express");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");

router.put("/updateCrop/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    const allowedUpdates = [
      "name",
      "harvestDate",
      "quantity",
      "unit",
      "pricePerUnit",
      "location",
      "status",
      "sell"
    ];

    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        crop[field] = updateData[field];
      }
    });

    await crop.save();

    res.status(200).json({
      message: "Crop updated successfully",
      crop
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;