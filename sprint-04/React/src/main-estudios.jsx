import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import StudiosApp from "./StudiosApp";
import "./CSS/base.css";
import "./CSS/catalog.css";
import "./CSS/studios.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StudiosApp />
  </StrictMode>
);
