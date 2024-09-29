import "./header.css";
import { Link, useNavigate  } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function UserHeader() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleLogout = () => {
    navigate("/");
    alert('You have sucessfully logged out\n Thank you for choosing us  😊₹');
  };

  return (
    <div className="main">
      <div className="main-container">
        <h2>銀行</h2>
        <div className="links">
          <Link className="link" to={`/${userId}/USER`}> Home </Link> |
          <Link className="link" to={`/${userId}/USER`}> Explore </Link> |
          <Link className="link" to={`/accounts/${userId}`}> Accounts </Link> |
          <Link className="link" to={`/history/${userId}`}> History </Link> |
          <Link className="link" to={`/cards/${userId}`}> Cards </Link> |
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
