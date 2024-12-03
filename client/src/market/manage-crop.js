import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Footer from "../header-footer/footer";
import "./manage-crops.css";
import FarmerHeader from "../header-footer/farmer-header";

export default function CropList() {
  const { userId } = useParams();
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [editingCropId, setEditingCropId] = useState(null);
  const [editedCrop, setEditedCrop] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5001/api/commerce/getallcrops/${userId}`)
      .then((response) => response.json())
      .then((data) => setCrops(data))
      .catch((error) => console.error(error));
  }, [userId]);

  const handleSell = async (cropId) => {
    const confirmation = window.confirm(t("add_crop_sale"));
    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/updateCrop/${cropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "available",
            sell: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCrops(crops.map((crop) => (crop._id === cropId ? data.crop : crop)));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleEdit = (cropId) => {
    setEditingCropId(cropId);
    const crop = crops.find((c) => c._id === cropId);
    setEditedCrop(crop);
  };

  const handleSave = async (cropId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/updateCrop/${cropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCrop),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCrops(crops.map((crop) => (crop._id === cropId ? data.crop : crop)));
      setEditingCropId(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleStopSale = async (cropId) => {
    const confirmation = window.confirm(t("remove_crop_sale"));
    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/updateCrop/${cropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sell: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCrops(crops.map((crop) => (crop._id === cropId ? data.crop : crop)));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleDelete = async (cropId) => {
    const confirmation = window.confirm(t("deletion_irreversible"));
    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/commerce/delete/${cropId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the crops state to remove the deleted crop
      setCrops(crops.filter((crop) => crop._id !== cropId));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditedCrop({ ...editedCrop, [field]: value });
  };

  return (
    <div className="crops-main">
      <FarmerHeader />
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
            {crops.map((crop) => {
              const isOutOfStock = crop.quantity - crop.soldQty <= 0;
              const isPossible =
                new Date(crop.harvestDate) <
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

              return (
                <tr key={crop._id}>
                  <td>
                    {editingCropId === crop._id ? (
                      <input
                        type="text"
                        value={editedCrop.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled
                      />
                    ) : (
                      crop.name
                    )}
                  </td>
                  <td>
                    {editingCropId === crop._id ? (
                      <input
                        type="text"
                        value={editedCrop.variety || ""}
                        onChange={(e) =>
                          handleChange("variety", e.target.value)
                        }
                        disabled
                      />
                    ) : (
                      crop.variety
                    )}
                  </td>
                  <td>
                    {editingCropId === crop._id ? (
                      <input
                        type="text"
                        value={editedCrop.category || ""}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        disabled
                      />
                    ) : (
                      crop.category
                    )}
                  </td>
                  <td>
                    {editingCropId === crop._id ? (
                      <input
                        type="text"
                        value={editedCrop.label || ""}
                        onChange={(e) => handleChange("label", e.target.value)}
                        disabled
                      />
                    ) : (
                      crop.label
                    )}
                  </td>
                  <td>
                    {editingCropId === crop._id ? (
                      <input
                        type="date"
                        value={editedCrop.harvestDate || ""}
                        onChange={(e) =>
                          handleChange("harvestDate", e.target.value)
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
                        value={editedCrop.quantity || ""}
                        onChange={(e) =>
                          handleChange("quantity", e.target.value)
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
                        value={editedCrop.unit || ""}
                        onChange={(e) => handleChange("unit", e.target.value)}
                        disabled
                      />
                    ) : (
                      crop.unit
                    )}
                  </td>
                  <td>
                    {editingCropId === crop._id ? (
                      <input
                        type="number"
                        value={editedCrop.pricePerUnit || ""}
                        onChange={(e) =>
                          handleChange("pricePerUnit", e.target.value)
                        }
                      />
                    ) : (
                      crop.pricePerUnit
                    )}
                  </td>
                  <td>
                    {isOutOfStock || isPossible ? (
                      isOutOfStock ? (
                        <button disabled className="out-of-stock">
                          {t("table.outOfStock")}
                        </button>
                      ) : (
                        <button disabled className="out-of-stock">
                          {t("table.late")}
                        </button>
                      )
                    ) : (
                      <>
                        {editingCropId === crop._id ? (
                          <button onClick={() => handleSave(crop._id)}>
                            {t("table.save")}
                          </button>
                        ) : crop.sell === true ? null : (
                          <button
                            onClick={() => handleEdit(crop._id)}
                            className="update"
                          >
                            {t("table.update")}
                          </button>
                        )}
                        {crop.sell === true ? (
                          <button
                            onClick={() => handleStopSale(crop._id)}
                            className="on-sale"
                          >
                            {t("table.stopSale")}
                          </button>
                        ) : editingCropId === crop._id ? null : (
                          <button
                            onClick={() => handleSell(crop._id)}
                            className="on-sale"
                          >
                            {t("table.sell")}
                          </button>
                        )}
                        {crop.sell === true ? null : (
                          <button
                            onClick={() => handleDelete(crop._id)}
                            className="on-sale"
                          >
                            {t("delete")}
                          </button>
                        )}
                      </>
                    )}
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
