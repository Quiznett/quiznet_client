//Author: Nishtha Srivatava
// -----------------------------------------------------------------------------
// File: App.jsx
// Purpose:
//   - Defines all application routes using React Router.
//   - Connects every page/component to its respective route.
//   - Organizes routes into logical groups: public, authentication,
//     dashboard, quiz flow (join → instructions → attempt → result),
//     and creator/owner tools.
//   - Serves as the main routing entry point of the frontend application.
// -----------------------------------------------------------------------------


import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import User from "./Pages/User";
import CreateQuiz from "./Pages/CreateQuiz";
import MyQuizzes from "./Pages/myQuizzes";

import JoinQuiz from "./Pages/JoinQuiz";
import Instructions from "./Pages/Instructions";
import AttemptQuiz from "./Pages/AttemptQuiz";
import Result from "./Pages/Result";


import AttemptedQuizzes from "./Pages/AttemptedQuizzes";
import QuizSubmissions from "./Pages/QuizSubmissions";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* 
        -------------------------------------------------------------------------
        Application Routes
        -------------------------------------------------------------------------
        Each route maps to a top-level page of the application.
        Pages are grouped logically:
        - Public routes
        - Authentication
        - Dashboard
        - Quiz Flow (join → instructions → attempt → result)
        - Creator-specific views
        -------------------------------------------------------------------------
      */}
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* User Dashboard */}
        <Route path="/user" element={<User />} />

        {/* Quiz Creation */}
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/myQuizzes" element={<MyQuizzes />} />

        {/* Join & Attempt Flow */}
        <Route path="/join-quiz" element={<JoinQuiz />} />
        <Route path="/instructions/:quizId" element={<Instructions />} />
        <Route path="/attempt/:quizId" element={<AttemptQuiz />} />
        <Route path="/result/:quizId" element={<Result />} />

        {/* Attempts & History */}
        <Route path="/given-quizzes" element={<AttemptedQuizzes />} />

        {/* Creator Responses Section */}
        <Route path="/quiz-response" element={<QuizSubmissions />} />
   

      </Routes>
    </BrowserRouter>
  );
}
