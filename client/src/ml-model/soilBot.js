import React, { useState } from "react";
import SoilInputForm from "./SoilInputForm";
import FarmerHeader from "../header-footer/farmer-header";
import Footer from "../header-footer/footer";

export default function SoilBot() {
  const [prediction, setPrediction] = useState("");

  const handlePredict = (predictedCrop) => {
    setPrediction(predictedCrop);
  };

  return (
    <div className="soil-bot">
      <FarmerHeader />
      <SoilInputForm onPredict={handlePredict} />
      {prediction && (
        <div>
          <h2>Recommended Crop: {prediction}</h2>
        </div>
      )}
      <Footer />
    </div>
  );
}
