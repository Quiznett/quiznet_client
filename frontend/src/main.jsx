//Author: Nishtha Srivatava


// -----------------------------------------------------------------------------
// Application Entry Point
// -----------------------------------------------------------------------------
// This file mounts the React application onto the DOM using React 18's `createRoot`.
// It also wraps the app with global providers such as ThemeProvider and AuthProvider.
// -----------------------------------------------------------------------------

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";                 // Global stylesheet
import App from "./App.jsx";          // Root application component
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Mount React app into the #root DOM element
createRoot(document.getElementById("root")).render(
 <>
    {/* Global providers for theme management and authentication */}
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
</>
);
