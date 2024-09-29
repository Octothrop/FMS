const express = require("express");
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");
const UserModel = require("../models.crop-commerce/user");
const Transaction = require("../models.crop-commerce/transaction");
const Order = require("../models.crop-commerce/order");


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
    await Crop.updateOne({cropId: crop.id}, {quantity: crop.quantity-quantity});
    const amount = crop.pricePerUnit * quantity;
    const cropUser = await UserModel.findById(crop.sellerId);
    if (!cropUser){
      return res.status(404).json({message: "Operation can't be performed"});
    }
    if (!user.GinkouAcc){
      alert("Register you Ginkou account first");
    }
    
    const details = {fromAccount: user.GinkouAcc, toAccount: cropUser.GinkouAcc, amount: amount, mode: "NEFT"};
    const order = await new Order({
      cropId: crop.id,
      buyerId: userId,
      quantity,
      price: crop.pricePerUnit
    });

    res.status(201).json({
      message: "Order created successfully",
      order, details
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transaction/save", async function(req, res){
  const {transactionData, orderId} = req.body;
  try{
    const transaction = await Transaction.save({
      transactionId: transactionData.transactionId,
      orderId,
      amount: transactionData.amount,
      fromAccountId: transactionData.fromAccountId,
      toAccountId: transactionData.toAccountId,
      mode: transactionData.mode,
      cardId: transactionData.cardId,
      time: transactionData.time,
      createdAt: transactionData.createdAt,
      updatedAt: transactionData.updatedAt
   } );

   res.status(200).json('Transaction sucessfully added', transaction);
  } catch(error){
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
});

module.exports = router;