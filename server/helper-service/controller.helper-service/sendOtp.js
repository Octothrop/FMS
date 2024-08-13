const twilio = require("twilio");
const otpGenerator = require("otp-generator");
const express = require('express');
const router = express.Router();
const UserModel = require("./user");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

router.put('/sendOtp/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    const toPhoneNumber = user.phoneNumber;

    const message = await client.messages.create({
      body: `Welcome to FMS 🌱🌾🚜😊 !!\nYour OTP code is ${otp}\nValid for 10 minutes.`,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    });

    user.otp = otp;
    await user.save();

    console.log("OTP sent successfully:", message.sid);
    return res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).send('Error sending OTP');
  }
});

module.exports = router;
