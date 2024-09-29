import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "./add-crops.css";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";

export default function AddCrop() {
  const { userId } = useParams();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("regular");
  const [category, setCategory] = useState("vegetable");
  const [label, setLabel] = useState("local");
  const [harvestDate, setHarvestDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [location, setLocation] = useState({ coordinates: [] });
  const [locationSet, setLocationSet] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/add/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            variety,
            category: category,
            label: label,
            harvestDate,
            quantity,
            unit,
            pricePerUnit,
            location,
            sellerId: userId,
          }),
        }
      );
      console.log(
        name,
        variety,
        category,
        label,
        harvestDate,
        quantity,
        unit,
        pricePerUnit,
        location,
        userId
      );
      if (!response.ok) {
        setError(true);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);
      setSuccess(true);
      alert(t("form.cropSetSucess"));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      alert(t("form.locationError"));
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        coordinates: [position.coords.longitude, position.coords.latitude],
      });
    });
    alert(t("form.setLocationSucess"));
    setLocationSet(true);
  };

  function reset() {
    window.location.reload();
  }

  return (
    <div className="addCrop-main">
      <Header />
      {!success && (
        <form onSubmit={handleSubmit} className="add-crop-form">
          <input
            type="text"
            placeholder={t("form.name")}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-input"
            required
          />
          <select
            value={variety}
            onChange={(event) => setVariety(event.target.value)}
            className="form-input"
            required
          >
            <option value="regular">{t("form.regular")}</option>
            <option value="dwarf">{t("form.dwarf")}</option>
            <option value="special">{t("form.special")}</option>
          </select>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="form-input"
            required
          >
            <option value="vegetable">{t("form.vegetable")}</option>
            <option value="fruit">{t("form.fruit")}</option>
          </select>
          <select
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="form-input"
            required
          >
            <option value="local">{t("form.local")}</option>
            <option value="non-local">{t("form.non-local")}</option>
          </select>
          <input
            type="date"
            placeholder={t("form.harvestDate")}
            value={harvestDate}
            onChange={(event) => setHarvestDate(event.target.value)}
            className="form-input"
            required
          />
          <input
            type="number"
            placeholder={t("form.quantity")}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="form-input"
            min={1}
            required
          />
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            className="form-input"
            required
          >
            <option value="kg">kg</option>
            <option value="ton">ton</option>
          </select>
          <input
            type="number"
            placeholder={t("form.pricePerUnit")}
            value={pricePerUnit}
            onChange={(event) => setPricePerUnit(event.target.value)}
            className="form-input"
            min={1}
            required
          />
          {!locationSet && (
            <button
              type="button"
              onClick={getCurrentLocation}
              className="form-button"
              required
            >
              {t("form.setLocation")}
            </button>
          )}
          <button type="submit" className="form-button">
            {t("form.addCrop")}
          </button>
          {error && (
            <p style={{ color: "red" }}>{t("form.cropCouldNotBeAdded")}</p>
          )}
        </form>
      )}
      {success && (
        <div className="success-message">
          <img
            src="https://img.freepik.com/free-vector/coffee-farm-concept-illustration_114360-12464.jpg?t=st=1727639361~exp=1727642961~hmac=a6020596006f8f68f1df1748a3430fb7238af2a0d3b4be60675190e2fd605a8a&w=1060"
            alt="Crop added successfully"
          />

          <button className="add crops" onClick={reset}>
            {t("form.addCrop")}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
