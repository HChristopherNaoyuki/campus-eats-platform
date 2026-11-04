import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/php-site.css";
import { registerPwa } from "./pwa";

createRoot(document.getElementById("root")!).render(<App />);

// Offline support. The wrapper refuses registration in dev and previews.
registerPwa();
