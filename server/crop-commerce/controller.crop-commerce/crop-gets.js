const express = require('express');
const router = express.Router();
const Crop = require("../models.crop-commerce/crop");

router.get("/getallcrops", async (req, res) => {
    try{
        const crops = await Crop.find({})
        res.status(200).send(crops);
    } catch(error) {
        res.status(400).send({error: "Internal erver error"});
    }
});

router.get("/getallcrops/:userId", async(req, res) => {
    try{
        const {userId} = req.params;
        const crops = await Crop.find({});
        const filteredCrop = [];
        crops.forEach((crop)=>{
            if(crop.sellerId == userId){
                filteredCrop.push(crop)
            } 
        });

        res.status(200).send(filteredCrop);
    } catch(error){
        console.log(error);
        res.status(400).send({error : "Internal server error"});
    }
});

module.exports = router;