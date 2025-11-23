import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import User from "./Pages/User";
import CreateQuiz from "./Pages/CreateQuiz";
import MyQuizzes from "./Pages/MyQuizzes";

import JoinQuiz from "./Pages/JoinQuiz";
import Instructions from "./Pages/Instructions";


import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/myQuizzes" element={<MyQuizzes />} />
        <Route path="/join-quiz" element={<JoinQuiz />} />
        <Route path="/instructions/:quizId" element={<Instructions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
