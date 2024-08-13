const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());

// connecting to MongoDB
const uri = process.env.ALTAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const otpVerifyRoutes = require('../controller.helper-service/verifyOtp');
const sendOtpRoutes = require("../controller.helper-service/sendOtp");
const weatherRoutes = require("../controller.helper-service/weatherService");

app.use('/api/service', otpVerifyRoutes);
app.use('/api/service', sendOtpRoutes);
app.use('/api/service', weatherRoutes);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
