import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Welcome from "./Pages/Welcome";

import CreateQuizForm from "./components/CreateQuizForm"; 
import CreateQuiz from "./Pages/CreateQuiz";
import MyQuizzes from "./Pages/myQuizzes";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />

        
        <Route path="/welcome" element={<Welcome />} />

        {/* Create Quiz Pages */}
        <Route path="/create-quiz-form" element={<CreateQuizForm />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />

        {/* My Quizzes */}
        <Route path="/myQuizzes" element={<MyQuizzes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
