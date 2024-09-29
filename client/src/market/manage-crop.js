import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import "./manage-crops.css";

export default function CropList() {
  const { userId } = useParams();
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [editingCropId, setEditingCropId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/commerce/getallcrops/${userId}`)
      .then((response) => response.json())
      .then((data) => setCrops(data))
      .catch((error) => console.error(error));
  }, [userId]);

  const handleSell = async (cropId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/updateCrop/${cropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "sold",
            sell: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);
      setCrops(crops.map((crop) => (crop._id === cropId ? data.crop : crop)));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleEdit = (cropId) => {
    setEditingCropId(cropId);
  };

  const handleSave = async (cropId, updatedCrop) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/updateCrop/${cropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCrop),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);
      setCrops(crops.map((crop) => (crop._id === cropId ? data.crop : crop)));
      setEditingCropId(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="crops-main">
      <Header />
      <div className="manage-crops">
        <table className={editingCropId ? "editing" : ""}>
          <thead>
            <tr>
              <th>{t("table.name")}</th>
              <th>{t("table.variety")}</th>
              <th>{t("table.category")}</th>
              <th>{t("table.label")}</th>
              <th>{t("table.harvestDate")}</th>
              <th>{t("table.quantity")}</th>
              <th>{t("table.unit")}</th>
              <th>{t("table.pricePerUnit")}</th>
              <th>{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop._id}>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="text"
                      value={crop.name}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, name: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.name
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="text"
                      value={crop.variety}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, variety: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.variety
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="text"
                      value={crop.category}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, category: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.category
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="text"
                      value={crop.label}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, label: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.label
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="date"
                      value={crop.harvestDate}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, harvestDate: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    new Date(crop.harvestDate).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="number"
                      value={crop.quantity}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, quantity: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.quantity
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="text"
                      value={crop.unit}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, unit: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.unit
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <input
                      type="number"
                      value={crop.pricePerUnit}
                      onChange={(e) =>
                        setCrops(
                          crops.map((c) =>
                            c._id === crop._id
                              ? { ...c, pricePerUnit: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    crop.pricePerUnit
                  )}
                </td>
                <td>
                  {editingCropId === crop._id ? (
                    <button
                      onClick={() =>
                        handleSave(
                          crop._id,
                          crops.find((c) => c._id === crop._id)
                        )
                      }
                    >
                      {t("table.save")}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(crop._id)}
                      className="update"
                    >
                      {t("table.update")}
                    </button>
                  )}
                  {editingCropId === crop._id ? (
                    <></>
                  ) : crop.status === "sold" ? (
                    crop.quantity > 0 ? (
                      <button disabled className="on-sale">
                        {t("table.onSale")}
                      </button>
                    ) : (
                      <button disabled className="sold">
                        {t("table.sold")}
                      </button>
                    )
                  ) : crop.quantity > 0 ? (
                    <button
                      disabled
                      onClick={() => handleSell(crop._id)}
                      className="on-sale"
                    >
                      {t("table.onSale")}
                    </button>
                  ) : (
                    <button disabled className="out-of-stock">
                      {t("table.outOfStock")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
