const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userModel = require('../models.login-auth/user');

// Route to handle user registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new userModel({ username, password: hashedPassword, phoneNumber });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "User exists" });
  }
});

router.post('/forgotpassword', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
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

module.exports = router;