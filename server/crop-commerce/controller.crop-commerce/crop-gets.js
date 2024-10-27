const express = require("express");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");
const User = require("../models.crop-commerce/user");

router.get("/getallcrops", async (req, res) => {
  try {
    const crops = await Crop.find({});
    res.status(200).send(crops);
  } catch (error) {
    res.status(400).send({ error: "Internal erver error" });
  }
});

router.delete("/delete/:cropId", async (req, res) => {
  try {
    const { cropId } = req.params;

    const deletedCrop = await Crop.findByIdAndDelete(cropId);

    if (!deletedCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res
      .status(200)
      .json({ message: "Crop deleted successfully", crop: deletedCrop });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the crop",
      error: error.message,
    });
  }
});

router.get("/getallcrops/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const crops = await Crop.find({});
    const filteredCrop = [];
    crops.forEach((crop) => {
      if (crop.sellerId == userId) {
        filteredCrop.push(crop);
      }
    });

    res.status(200).send(filteredCrop);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Internal server error" });
  }
});

router.get("/getAllCropsOnSale", async (req, res) => {
  try {
    const crops = await Crop.find({
      sell: true,
      $expr: { $gt: [{ $subtract: ["$quantity", "$soldQty"] }, 0] },
    });

    res.status(200).json(crops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/harvestDate/:cropId", async (req, res) => {
  const { cropId } = req.params;
  try {
    const crop = await Crop.findOne({ _id :cropId });

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.status(200).json(crop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/userRole/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id:userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ Role: user.Role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
