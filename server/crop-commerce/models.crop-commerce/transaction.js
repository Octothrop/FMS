const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  transactionId: {
    type: Number,
    required: true,
    unique: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  fromAccountId: {
    type: Number,
    required: true,
  },
  toAccountId: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    enum: ["NEFT", "IMPS", "RTGS", "UPI"],
    required: true,
  },
  cardId: {
    type: Number,
    default: null,
  },
  time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    required: true,
  },
  remark: {
    type: String,
    default: "",
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
transactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
