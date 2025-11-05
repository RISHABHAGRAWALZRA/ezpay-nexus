import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Web3Provider from "./context/Web3Context";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element with id "root" not found');

createRoot(rootElement).render(
  <StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </StrictMode>
);
