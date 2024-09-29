import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header-footer/header";
import { useTranslation } from "react-i18next";

export default function LoginComponent() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password,
        }),
      });

      if (!response.ok) {
        console.log(response.json());
        throw new Error(t("invalid_credentials"));
      }

      const data = await response.json();
      console.log("Success:", data);
      setSuccess(true);
      navigate(`/${data.user._id}`);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-main">
        <form className="login-form" onSubmit={loginUser}>
          <span>{t("app_name")}</span>
          <br />
          <label htmlFor="username">{t("username_label")}</label>
          <input
            type="text"
            id="userName"
            className="login-input"
            placeholder={t("username_placeholder")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">{t("password_label")}</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder={t("password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength="12"
            minLength="3"
            required
          />
          <br />
          {error && (
            <p
              className="error-message"
              style={{ color: "red", textAlign: "center" }}
            >
              {t("error_message")}
            </p>
          )}
          {success && <p className="success-message">{t("success_message")}</p>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? t("loading") : t("login_button")}
          </button>
          <p className="go-to-register">
            {t("no_account")}{" "}
            <Link className="link" to="/register">
              {t("register")}
            </Link>
          </p>
        </form>
        <img
          src="https://img.freepik.com/free-vector/organic-farming-concept-illustration_23-2148426996.jpg?t=st=1727612017~exp=1727615617~hmac=7144830f0fb5e3d7f269990f08ac95fc15b2151bed0a904f20529b33c1ef201c&w=1060"
          alt="login-with-FMS"
        />
      </div>
    </>
  );
}
