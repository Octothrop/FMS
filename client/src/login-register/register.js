import "./register.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header-footer/header";
import { useTranslation } from "react-i18next";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { t } = useTranslation();

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (password !== confirmPassword) {
        setError(t("password_mismatch"));
        setLoading(false);
      } else {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            password,
            phoneNumber,
          }),
        });

        if (!response.ok) {
          throw new Error(t("network_error"));
        }

        const data = await response.json();
        console.log("Success:", data);
        setSuccess(t("registration_success"));
        navigate('/login');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="register-main">
        <img
          src="https://img.freepik.com/free-vector/hand-drawn-illustrated-farming-profession_23-2148889459.jpg?t=st=1727611962~exp=1727615562~hmac=57a7f3208cc4f04907f3bdeaf63aed46f36af7187a1fe75b71748e55c8725dc3&w=826"
          alt="register-illustration"
        />
        <form className="register-container" onSubmit={registerUser}>
          <span>{t("app_name")}</span>
          <br />
          <label htmlFor="username">{t("username_label")}</label>
          <input
            type="text"
            id="userName"
            className="register-input"
            placeholder={t("username_placeholder")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="phoneNumber">{t("phone_label")}</label>
          <input
            type="text"
            id="phoneNumber"
            className="register-input"
            placeholder={t("phone_placeholder")}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">{t("password_label")}</label>
          <input
            type="password"
            id="password"
            className="register-input"
            placeholder={t("password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength="12"
            minLength="8"
            required
          />
          <br />
          <label htmlFor="confirmPassword">{t("confirm_password_label")}</label>
          <input
            type="password"
            id="confirmPassword"
            className="register-input"
            placeholder={t("confirm_password_placeholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            maxLength="12"
            minLength="8"
            required
          />
          <br />
          {error && (
            <p style={{ color: "red", textAlign: "center" }} className="error-message">
              {t("error_message")}
            </p>
          )}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? t("loading") : t("register_button")}
          </button>
          <p className="go-to-login">
            {t("have_account")}{" "}
            <Link className="link" to="/login">
              {t("login")}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
