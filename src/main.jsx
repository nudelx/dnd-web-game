import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/index.js";
import App from "./App.jsx";

// Set initial language and direction
const savedLang = localStorage.getItem("i18nextLng") || "en";
document.documentElement.lang = savedLang;
document.documentElement.dir = savedLang === "he" ? "rtl" : "ltr";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
