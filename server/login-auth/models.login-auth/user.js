const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 8,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+91\s\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  KYCReg: {
    type: Boolean,
    default: false,
  },
  Role: {
    type: String,
    enum: ["farmer", "agent", "buyer", "admin"],
    default: "buyer",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
