// NotFound.js
import React from "react";
import './Error.css'
//import Header from "../header-footer/header";

const NotFound = () => {
  return (
    <div>
      {/* <Header /> */}
      <div class="error-main">
      <div class="noise"></div>
      <div class="overlay"></div>
      <div class="terminal">
        <h1>
          Error <span class="errorcode">404</span>
        </h1>
        <p class="output">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
        <p class="output">
          Please try to <a href="#">go back</a> or{" "}
          <a href="#">return to the homepage</a>.
        </p>
        <p class="output">Good luck.</p>
      </div>{" "}
      </div>
    </div>
  );
};

export default NotFound;
