const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userModel = require('../models.login-auth/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send("Incorrect password");
    }

    if (!user.otpVerified) {
        return res.status(402).send("OTP not verified yet");
    }
    
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
        expiresIn: "1h", // To keep user logged in for max 1hr
    });

    res.status(200).json({ message: `${user.username} logging successful`, token });
} catch (error) {
    console.error("Error logging in...", error);
    res.status(500).send("Internal server error");
}
});

module.exports = router;
