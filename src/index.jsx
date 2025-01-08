import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpellingApp } from "./screens/SpellingApp";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <SpellingApp />
  </StrictMode>,
);
