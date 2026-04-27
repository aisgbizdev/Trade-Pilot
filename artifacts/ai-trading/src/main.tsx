import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      console.log("[pwa] service worker registered", { swUrl, scope: registration?.scope });
    },
    onRegisterError(error) {
      console.error("[pwa] service worker registration failed", error);
    },
  });
}

createRoot(document.getElementById("root")!).render(<App />);
