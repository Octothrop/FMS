import React from "react";
import "./header.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function FarmerHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/");
    alert("You have successfully logged out\nThank you for your support 😊");
  };

  return (
    <div className="main">
      <div className="main-container">
        <h2 className="logo">🌿FMS🌿</h2>
        <div className="links">
          | <Link className="link" to={`/${userId}`}> Home </Link> |
          <Link className="link" to={`/${userId}`}> Explore </Link> |
          <Link className="link" to={`/addCrops/${userId}`}> Add Crops </Link> |
          <Link className="link" to={`/manageCrops/${userId}`}> Manage Crops </Link> |
          <Link className="link" to={`/manageOrders/${userId}`}> Manage Orders </Link> |
          <Link className="link" to={`/bot/${userId}`}>Bot</Link> |
          <Link className="link" to="/" onClick={handleLogout}> Logout </Link> |
          <div className="language-switcher">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <marquee className="marquee-block">
        {t("marquee-text")}
      </marquee>
    </div>
  );
}
