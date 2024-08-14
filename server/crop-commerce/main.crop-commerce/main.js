const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = process.env.ALTAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const sellRoutes = require('../controller.crop-commerce/sell');
const buyRoutes = require('../controller.crop-commerce/buy');
const updateCropRoutes = require('../controller.crop-commerce/update-crop');
const cropGetRoutes = require('../controller.crop-commerce/crop-gets')

app.use('/api/commerce', sellRoutes);
app.use('/api/commerce', buyRoutes);
app.use('/api/commerce', updateCropRoutes);
app.use('/api/commerce', cropGetRoutes);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
