import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "@app/_styles/style.css";
import "@assets/fonts/noir-pro/styles.css";
import App from "@app/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
