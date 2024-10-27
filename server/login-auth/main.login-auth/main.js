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

// Importing and using routes from controllers
const loginRoutes = require('../controller.login-auth/login');
const registerRoutes = require('../controller.login-auth/register');

// Adding the routes to the app
app.use('/api/auth', loginRoutes);
app.use('/api/auth', registerRoutes);

// start server
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
