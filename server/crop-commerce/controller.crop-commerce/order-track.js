const express = require("express");
const router = express.Router();
const Order = require("../models.crop-commerce/order");
const Crop = require("../models.crop-commerce/crop");
const User = require("../models.crop-commerce/user");

router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const role = user.Role;
    let orders;

    if (role === "buyer") {
      orders = await Order.find({ buyerId: userId }).populate("cropId");
    } else if (role === "farmer") {
      const crops = await Crop.find({ sellerId: userId });
      const cropIds = crops.map((crop) => crop._id);
      orders = await Order.find({ cropId: { $in: cropIds } }).populate("cropId");
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    const pending = [];
    const success = [];
    const failed = [];

    orders.forEach((order) => {
      switch (order.status) {
        case "pending":
          pending.push(order);
          break;
        case "completed":
          success.push(order);
          break;
        case "cancelled":
          failed.push(order);
          break;
        default:
          break;
      }
    });

    res.status(200).json({ pending, success, failed, role});
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
