const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  cropId: {
    type: Schema.Types.ObjectId,
    ref: "Crop", // Reference to the Crop schema
    required: true,
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction"
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  transactionId: {
    type: String
  },
  extraDay: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// save -> runs for save + update
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
