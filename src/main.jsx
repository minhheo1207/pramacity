// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router/AppRouter.jsx";

// (tuỳ chọn) global css
import "./assets/css/styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
