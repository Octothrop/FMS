import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../header-footer/footer";
import "./buy-crops.css";
import UserHeader from "../header-footer/user_header";

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function BuyCrops() {
  const { t } = useTranslation();
  const { userId, orderId, pay, transactionId } = useParams();
  const navigate = useNavigate();
  const [cropsOnSale, setCropsOnSale] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState(Infinity);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );

    fetch("http://localhost:5001/api/commerce/getAllCropsOnSale")
      .then((response) => response.json())
      .then((data) => {
        setCropsOnSale(data);
        setFilteredCrops(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (userLocation) {
      const newFilteredCrops = cropsOnSale.filter((crop) => {
        const cropLocation = {
          latitude: crop.location.coordinates[1],
          longitude: crop.location.coordinates[0],
        };
        const distance = haversineDistance(userLocation, cropLocation);
        return distance <= maxDistance;
      });
      setFilteredCrops(newFilteredCrops);
      setFilterApplied(newFilteredCrops.length < cropsOnSale.length);
    }
  }, [maxDistance, cropsOnSale, userLocation]);

  const handleBuy = async (cropId, cropLocation) => {
    const confirmation = window.confirm(`${t("confirm_buy")}\n We require additional ${Math.ceil(haversineDistance(userLocation, cropLocation) / 300)} days to deliver after crop is out for delivery`);
    if (!confirmation) return;

    const qty = window.prompt(t("enter_quantity"));
    if (qty === null) return;
    const quantity = parseInt(qty, 10);

    if (isNaN(quantity) || quantity <= 0) {
      alert(t("invalid_quantity"));
      return;
    }
    
    const extraDay = Math.ceil(haversineDistance(userLocation, cropLocation) / 300);

    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/buyCrop/${userId}/${cropId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity, extraDay }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    if (orderId) {
      const handlePaymentStatus = async () => {
        try {
          const response = await fetch(`http://localhost:5001/api/commerce/updateOrderStatus/${orderId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pay: pay === 'true', transactionId: transactionId }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Order status updated:", data);

          setTimeout(() => {
            navigate(`/buyCrops/${userId}`);
          }, 5000);
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      };

      handlePaymentStatus();
    }
  }, [orderId, pay, t, navigate, userId]);

  const toggleFilter = () => {
    if (filterApplied) {
      setMaxDistance(Infinity);
    } else {
      setMaxDistance(maxDistance);
    }
    setFilterApplied(!filterApplied);
  };

  return (
    <div className="buy-crops-main">
      <UserHeader />
      <div className="buy-crops">
        <div className="filter-section">
          <input
            type="number"
            value={maxDistance === Infinity ? '' : maxDistance}
            onChange={(e) => setMaxDistance(e.target.value === '' ? Infinity : e.target.value)}
            placeholder={filterApplied ? t("max_distance_placeholder") : "Enter distance"}
          />
          <button className="filter-btn" onClick={toggleFilter}>
            {filterApplied ? t("remove_filter") : t("filter")}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>{t("table.name")}</th>
              <th>{t("table.variety")}</th>
              <th>{t("table.harvestDate")}</th>
              <th>{t("table.quantity")}</th>
              <th>{t("table.pricePerUnit")}</th>
              <th>{t("table.distance")}</th>
              <th>{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCrops.map((crop) => {
              const cropLocation = {
                latitude: crop.location.coordinates[1],
                longitude: crop.location.coordinates[0],
              };
              const distance =
                userLocation && cropLocation
                  ? haversineDistance(userLocation, cropLocation).toFixed(2)
                  : "N/A";

              return (
                <tr key={crop._id}>
                  <td>{t(crop.name)}</td>
                  <td>{t(crop.variety)}</td>
                  <td>{new Date(crop.harvestDate).toLocaleDateString()}</td>
                  <td>{crop.quantity - crop.soldQty}</td>
                  <td>{crop.pricePerUnit}</td>
                  <td>{distance} km</td>
                  <td>
                    <button onClick={() => handleBuy(crop._id, cropLocation)}>
                      {t("table.buy")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
