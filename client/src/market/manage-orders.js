import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import "./manage-order.css";
import UserHeader from "../header-footer/user_header";
import FarmerHeader from "../header-footer/farmer-header";

export default function OrdersPage() {
  const { userId } = useParams();
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [trackedOrderId, setTrackedOrderId] = useState(null);
  const [role, setRole] =useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/orders/${userId}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        const allOrders = [
          ...data.pending.map((order) => ({ ...order, status: "Pending" })),
          ...data.success.map((order) => ({ ...order, status: "Success" })),
          ...data.failed.map((order) => ({ ...order, status: "Failed" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRole(data.role);
        setOrders(allOrders);
      } catch (err) {
        setError(t("errorFetching", { error: err.message }));
      }
    };

    fetchOrders();
  }, [userId, t]);

  const calculateDeliveryDays = (harvestDate) => {
    const harvest = new Date(harvestDate);
    const today = new Date();
    const daysSinceHarvest = Math.floor(
      (today - harvest) / (1000 * 60 * 60 * 24)
    );
    const expectedSaleDays = 10;
    const deliveryDays = 2;
    return expectedSaleDays + deliveryDays - daysSinceHarvest;
  };

  const getDeliveryStage = (days) => {
    if (days < 0) return { stage: "Delivered", completed: 3 };
    if (days < 2) return { stage: "Out for Delivery", completed: 2 };
    if (days < 5) return { stage: "Crop Harvested", completed: 1 };
    return { stage: "Not harvested yet", completed: 0 };
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="orders-page">
      {role === "buyer" ? <UserHeader /> : <FarmerHeader />}
      <div className="manage-orders">
        <table className="order-table">
          <thead>
            <tr>
              <th>{t("cropName")}</th>
              <th>{t("quantity")}</th>
              <th>{t("price")}</th>
              <th>{t("status")}</th>
              <th>{t("date")}</th>
              <th>{t("track")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className={getStatusClass(order.status)}>
                  <td>{t(order.cropId.name)}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{t(order.status)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {" "}
                    {order.status === "Success" ? (
                      <button
                        className="track-btn"
                        onClick={() => {
                          if (trackedOrderId === order._id) {
                            setTrackedOrderId(null);
                          } else {
                            setTrackedOrderId(order._id);
                          }
                        }}
                      >
                        {t("track")}
                      </button>
                    ) : (
                      <button className="track-btn-r" disabled>
                        . N/A .
                      </button>
                    )}
                  </td>
                </tr>
                {trackedOrderId === order._id && (
                  <tr>
                    <td colSpan="6">
                      <div className="progress-bar">
                        {[t("harvested"), t("ofd"), t("delivered")].map(
                          (stage, index) => {
                            const days = calculateDeliveryDays(
                              order.cropId.harvestDate
                            );
                            const { completed } = getDeliveryStage(days);
                            const isCompleted = index <= completed;
                            return (
                              <div key={index} className="progress-step">
                                <div
                                  className={`step-marker ${
                                    isCompleted ? "completed" : ""
                                  }`}
                                />
                                <span
                                  className={`step-text ${
                                    isCompleted ? "completed-text" : ""
                                  }`}
                                >
                                  {isCompleted ? (stage): ""}
                                </span>
                                {index >= 0 && (
                                  <div
                                    className={`line ${
                                      isCompleted ? "completed-line" : ""
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                      {calculateDeliveryDays(order.cropId.harvestDate) > 0 && (
                        <div className="delivery-status">
                          {t("tud")}{" "}
                          {calculateDeliveryDays(order.cropId.harvestDate)}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

function getStatusClass(status) {
  if (status === "Pending") return "text-yellow";
  if (status === "Success") return "text-green";
  if (status === "Failed") return "text-red";
  return "";
}
