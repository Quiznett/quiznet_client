//Author: Nishtha 


// Sets up client-side routing using react-router-dom.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage"; // Home / landing page component
import Signup from "./Pages/Signup";           // Signup form component
import Login from "./Pages/Login";             // Login form component

import "./index.css"; // Global styles

function App() {
  return (
    // BrowserRouter wraps the app to enable routing
    <BrowserRouter>
      <Routes>
        {/* Route for the landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Routes for authentication */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
