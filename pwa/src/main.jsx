import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./serviceWorker.js", { scope: "/" })
    .then((reg) => {
      // registration worked
      console.log("Registration succeeded. Scope is " + reg.scope);
    })
    .catch((error) => {
      // registration failed
      console.log("Registration failed with " + error);
    });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
