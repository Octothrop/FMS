const express = require("express");
const UserModel = require("../models.helper-service/user");
const router = express.Router();

router.post("/verify/otp/:username", async (req, res) => {
  try {
    const {otp} = req.body;
    const {username} = req.params;
    const user = await UserModel.findOne({ username });
    if(!user){
      res.status(400).send("user not found");
    }
    if (otp === user.otp) {
      user.otpVerified = true;
      await user.save();
      res.status(200).send("OTP verified sucessfully");
    } else {
      res.status(500).send({ error: "OTP doesn't match" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
