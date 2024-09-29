import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();

  return (
    <div className="main">
      <div className="main-container">
        <h2 className="logo">🌿FMS🌿</h2>
        <div className="links">
          | <Link className="link" to="/"> Home </Link> |
          <Link className="link" to="/"> Explore </Link> |
          <Link className="link" to="/"> Login/Register </Link> |
          <div className="language-switcher">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      <marquee className="marquee-block">
        {t('marquee-text')}
      </marquee>
    </div>
  );
}
