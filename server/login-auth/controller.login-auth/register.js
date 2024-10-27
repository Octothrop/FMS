const express = require("express");
const bcrypt = require("bcryptjs");
const axios = require('axios');
const router = express.Router();
const userModel = require("../models.login-auth/user");

// Route to handle user registration
router.post("/register", async (req, res) => {
  try {
    const { username, password, phoneNumber, GinkouAcc, Role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      username,
      password: hashedPassword,
      phoneNumber,
      GinkouAcc,
      Role
    });
    await user.save();
    // await axios.put(`http://localhost:5050/api/service/sendOtp/${username}`);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid details while registration" });
  }
});

router.put("/forgotpassword", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/changePhoneNumber", async (req, res) => {
  try {
    const { username, phoneNumber } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.phoneNumber = phoneNumber;
    await user.save();

    res.status(200).json({ message: "PhoneNumber updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
