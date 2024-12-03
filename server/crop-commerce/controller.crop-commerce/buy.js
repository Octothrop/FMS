const express = require("express");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");
const UserModel = require("../models.crop-commerce/user");
const Order = require("../models.crop-commerce/order");

router.post("/buyCrop/:userId/:cropId", async (req, res) => {
  try {
    const { userId, cropId } = req.params;
    const { quantity, extraDay } = req.body;
    const crop = await Crop.findById(cropId);
    
    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    const soldQty = crop.soldQty || 0;
    if (crop.quantity < quantity + soldQty) {
      return res.status(400).json({ error: "Insufficient crop quantity" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    const amount = crop.pricePerUnit * quantity;
    const cropUser = await UserModel.findById(crop.sellerId);
    if (!cropUser) {
      return res.status(404).json({ message: "Operation can't be performed" });
    }

    if (!user.GinkouAcc) {
      return res.status(400).json({ message: "Register your Ginkou account first" });
    }
    

    const order = await new Order({
      cropId: cropId,
      buyerId: userId,
      quantity,
      price: crop.pricePerUnit,
      extraDay
    }).save();

    
    const originalUrl = `http://localhost:3000/buyCrops/${userId}/${order._id}`;
    const paymentUrl = `http://localhost:3001/ginkou/payment/${userId}/${order._id}?toAccountId=${cropUser.GinkouAcc}&fromAccountId=${user.GinkouAcc}&mode=NETBANKING&amount=${amount}&url=${originalUrl}`;
    
    res.status(201).json({
      message: "Order created successfully",
      order,
      paymentUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updateOrderStatus/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { pay, transactionId } = req.body;

  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (pay) {
      if (order.transactionId !== transactionId) {
        await Crop.updateOne(
          { _id: order.cropId },
          { 
            $inc: { soldQty: order.quantity /2 },
            $set: {transactionId}
          }
        );
    
        order.transactionId = transactionId;
      }
      
      order.status = "completed";
    } else {
      order.status = "cancelled";
    }

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
