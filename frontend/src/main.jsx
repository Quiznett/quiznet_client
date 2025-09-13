//Author: Nishtha
//Date: 13/09/2025
// Entry point of the React application. 
// Responsible for rendering the root React component into the HTML DOM.

import { StrictMode } from 'react';                // Enables additional checks and warnings for development
import { createRoot } from 'react-dom/client';    // React 18+ API to create root for rendering
import './index.css';                              // Global styles
import App from './App.jsx';                       // Main App component

// Create a React root and render the App component inside <StrictMode>
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);