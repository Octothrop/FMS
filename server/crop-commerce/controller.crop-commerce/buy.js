const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");
const UserModel = require("../models.crop-commerce/user");
const Transaction = require("../models.crop-commerce/transaction");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/buyCrop/:userId/:cropId", async (req, res) => {
  try {
    const { userId, cropId } = req.params;
    const { quantity } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    if (crop.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient crop quantity" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "agent" && !cropId) {
      const { name, variety, harvestDate, unit, pricePerUnit, location } =
        crop.toObject();

      // agent should update
      var new_crop = new Crop({
        name,
        variety,
        harvestDate,
        quantity,
        unit,
        pricePerUnit,
        sellerId: userId,
        location,
      });

      await new_crop.save();
    }

    const amount = crop.pricePerUnit * quantity * 100; // converting to paisa for Razorpay

    // Razorpay order
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);

    // Save the transaction
    const transaction = new Transaction({
      userId: userId,
      cropId: cropId,
      amount: amount / 100,
      orderId: order.id,
      status: "pending",
      razorpayCreatedAt: new Date(order.created_at * 1000),
    });

    await transaction.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: order.id,
      amount: amount / 100,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const verifyPaymentSignature = (order_id, payment_id, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");
  return expectedSignature === signature;
};

// Payment verification FE
router.post("/paymentVerification", async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  // Verify payment signature
  if (!verifyPaymentSignature(order_id, payment_id, signature)) {
    return res.status(400).json({ error: "Invalid payment signature" });
  }

  try {
    const pendingTransaction = await Transaction.findOne({
      orderId: order_id,
      status: "pending",
    });

    if (!pendingTransaction) {
      return res
        .status(404)
        .json({ error: "Transaction not found or already processed" });
    }

    pendingTransaction.paymentId = payment_id;
    pendingTransaction.status = "completed";
    await pendingTransaction.save();

    const crop = await Crop.findById(pendingTransaction.cropId);
    if (crop) {
      crop.quantity -= pendingTransaction.amount / crop.pricePerUnit;
      crop.status = crop.quantity <= 0 ? "sold" : "available";
      await crop.save();
    }

    res.status(200).json({ message: "Payment successful and crop updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;