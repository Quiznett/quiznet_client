// Author: Nishtha
// App.jsx - Sets up client-side routing using react-router-dom

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages / Components
import LandingPage from "./Pages/LandingPage"; // Home / landing page
import Register from "./Pages/Register";        // Register form
import Login from "./Pages/Login";             // Login form
import Welcome from "./Pages/welcome";         //  welcome page

import "./index.css"; // Global styles

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Home page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication routes */}
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
