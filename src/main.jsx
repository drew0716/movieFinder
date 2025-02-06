import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.scss"; // Import global styles only once

const isProd = import.meta.env.MODE === "production";

ReactDOM.createRoot(document.getElementById("root")).render(
    <HashRouter>
      <App />
    </HashRouter>
);
