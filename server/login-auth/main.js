const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
// json as server is sending and recieving json
app.use(express.json());

// connecting to mangoDB
const uri = process.env.ALTAS_URI; // from mongoDB atlas
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', ()=> {
    console.log('Coonected to MongoDB successfully !!');
})

// start server
app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
});
