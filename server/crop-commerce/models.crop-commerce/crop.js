const mongoose = require("mongoose");
const { Schema } = mongoose;

const cropSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  variety: {
    type: String,
  },
  harvestDate: {
    type: Date,
    required: true
  },
  plantingDate: {
    type: Date,
    required: true,
    immutable: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "ton"],
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User", // uses User schema
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "sold", "pending"],
    default: "available",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
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
cropSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// for effiecient geo query processing
cropSchema.index({ location: "2dsphere" });

const Crop = mongoose.model("Crop", cropSchema);

module.exports = Crop;
