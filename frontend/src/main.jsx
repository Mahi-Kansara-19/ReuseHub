import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

console.log("========== FRONTEND ENV AUDIT ==========");
console.log("VITE_API_URL raw value:", import.meta.env.VITE_API_URL);
console.log("VITE_GOOGLE_CLIENT_ID raw value:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log("========================================");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);