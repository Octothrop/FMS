const express = require("express");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");

router.post("/add/:sellerId", async (req, res) => {
  try {
    const {sellerId} = req.params;
    const {
      name,
      variety,
      harvestDate,
      category,
      label,
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
      category,
      label,
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

router.post("/sell/:cropId", async function (req, res) {
  const cropId = req.params;
  try{
    const crop = await Crop.findOneAndUpdate(
      { _id: cropId },
      { sell: true },
      { new: true }
    );
    res.status(200).json({message: `crop ${crop.cropId} is on sale`});
  } catch(error){
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
})

module.exports = router;
