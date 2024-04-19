import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import NavLinks from "./components/navegacion/NavLinks.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("nav-links")!).render(
  <React.StrictMode>
    <NavLinks />
  </React.StrictMode>
);