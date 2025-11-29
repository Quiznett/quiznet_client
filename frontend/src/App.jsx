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

import QuizAttempterList from "./Pages/QuizAttempterList";
 import AttemptedQuizzes from "./Pages/AttemptedQuizzes";
import QuizSubmissions from "./Pages/QuizSubmissions";  








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

        <Route path="/attempt/:quizId" element={<AttemptQuiz />} />
     
       <Route path="/quiz-response" element={<QuizSubmissions />} />
<Route path="/quiz/:quizId/attempters" element={<QuizAttempterList />} />
        <Route path="/result/:quizId" element={<Result />} />
<Route path="/given-quizzes" element={<AttemptedQuizzes />} />


          


       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
