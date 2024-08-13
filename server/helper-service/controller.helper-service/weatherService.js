const axios = require('axios');
const express = require('express');
const router = express.Router();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;


// Function to fetch weather data
router.get('/weather',async (req,res) => {
  try {
    const { lat, lon } = req.body;
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`);
    const weatherData = response.data;
    res.status(200).send(weatherData)
  } catch (error) {
    console.error(error);
    res.status(400).send({error: 'Error occurred while fetching...'})
  }
});

module.exports = router;