const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const userModel = require('../models.login-auth/user');

router.post('/register', async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new userModel({ username, password: hashedPassword, phoneNumber });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
} catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
}
});

module.exports = router;
