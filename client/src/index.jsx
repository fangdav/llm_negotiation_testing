import "@unocss/reset/tailwind-compat.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "uno.css";
import "virtual:uno.css";
import "../node_modules/@empirica/core/dist/player.css";
import App from "./App";

/*import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "https://5c587e081dd1eb53cc694a63bc669f6f@o4506346499604480.ingest.sentry.io/4506346501111808",
});*/

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
