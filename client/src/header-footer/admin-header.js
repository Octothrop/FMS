import React, { useState } from "react";
import "./header.css";
import { Link, useNavigate  } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/");
    alert('You have sucessfully logged out\n Thank you for your support  😊₹');
  };

  return (
    <div className="main">
      <div className="main-container">
        <h2>銀行</h2>
        <div className="links">
          <Link className="link" to={`/${1}/ADMIN`}> Home </Link> |
          <Link className="link" to={`/${1}/ADMIN`}> Explore </Link> |
          <Link className="link" to="/manage/users"> Users </Link> |
          <Link className="link" to="/manage/transactions"> Transactions </Link> |
          <Link className="link" to="/manage/accounts"> Accounts </Link> |
          <Link className="link" to="/" onClick={handleLogout}> Logout </Link>
          
        </div>
      </div>
      <marquee className="marquee-block">
        {" "}
        ನಿಮ್ಮ ಖಾತೆಯ ಬ್ಯಾಲೆನ್ಸ್ ಯಾವುದೇ ಸಮಯದಲ್ಲಿ, ಎಲ್ಲೆಲ್ಲಿ ನೋಡಿ! 24/7 ನಾವು ನಿಮ್ಮ
        ನೆರವಿಗೆ ಇರುತ್ತೇವೆ! ಇಂದು ನಮ್ಮ ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಕ್ರಾಂತಿಯಲ್ಲಿ ಸೇರಿ!{" "}
      </marquee>
    </div>
  );
}
