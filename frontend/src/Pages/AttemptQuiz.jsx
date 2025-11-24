import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import TimerBar from "../components/TimerBar";
import QuizSidePanel from "../components/QuizSidePanel";
import axios from "../api/axios";

import { saveAnswer, submitQuiz, getQuizStatus } from "../api/attempt";

export default function Attempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timer, setTimer] = useState(null);

  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    axios
      .get(`/api/v1/quiz/attempt/${quizId}/`)
      .then((res) => {
        setQuiz(res.data);
        setResponses(res.data.responses || {});
      })
      .finally(() => setLoading(false));
  }, [quizId]);

 
  //---------------------------------------------
  useEffect(() => {
    if (!quiz) return;

    const loadStatus = async () => {
      try {
        const status = await getQuizStatus(quizId);

        if (status.already_submitted) {
          navigate(`/result/${quizId}`);
          return;
        }

        if (!status.is_active || status.quiz_ended) {
          alert("Quiz has ended");
          handleSubmit();
          return;
        }

     
        const serverNow = new Date(status.now).getTime();
        const endsOn = new Date(status.ends_on).getTime();

        const remaining = Math.floor((endsOn - serverNow) / 1000);

        if (remaining <= 0) {
          handleSubmit();
          return;
        }

       
        setTimer({
          endTime: endsOn,
          remaining,
        });
      } catch (err) {
        console.error("Status fetch error:", err);
      }
    };

    loadStatus();
  }, [quiz]);


  //---------------------------------------------
  useEffect(() => {
    if (!timer?.endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((timer.endTime - now) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        handleSubmit();
        return;
      }

      setTimer((prev) => ({ ...prev, remaining: diff }));
    }, 500);

    return () => clearInterval(interval);
  }, [timer?.endTime]);

 
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await getQuizStatus(quizId);

        if (status.quiz_ended) {
          alert("⛔ Quiz ended!");
          handleSubmit();
          return;
        }

        if (status.already_submitted) {
          navigate(`/result/${quizId}`);
          return;
        }
      } catch (err) {
        console.error("Status check failed", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [quizId]);

 
  const handleSave = async (questionId, answerNumber) => {
    try {
      await saveAnswer(quizId, questionId, answerNumber);
      setResponses((prev) => ({ ...prev, [questionId]: answerNumber }));
    } catch (err) {
      console.log("Error saving answer", err);
    }
  };

  const handleOptionSelect = (questionId, answerNumber) => {
    handleSave(questionId, answerNumber);
  };

 
  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const jumpToQuestion = (index) => setCurrentIndex(index);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/v1/quiz/attempt/${quizId}/submit/`);
      localStorage.setItem("quiz_score", res.data.score);
      navigate(`/result/${quizId}`);
    } catch (err) {
      console.error(err);
    }
  };

 
  if (loading || !quiz || !timer?.remaining) {
    return <div className="text-center p-8 text-gray-600">Loading quiz...</div>;
  }

  const q = quiz.questions[currentIndex];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">

        <QuizSidePanel
          questions={quiz.questions}
          responses={responses}
          currentIndex={currentIndex}
          jumpTo={jumpToQuestion}
        />

        <section className="flex-grow p-6 flex justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            
            {/* Timer bar */}
            <TimerBar
              current={timer.remaining}
              total={quiz.time_limit_minutes * 60}
            />

            {/* Timer clock */}
            <div className="text-right text-lg font-semibold mb-4 text-red-600">
              ⏳ {Math.floor(timer.remaining / 60)}:
              {String(timer.remaining % 60).padStart(2, "0")}
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold dark:text-gray-200 mb-4">
              Q{currentIndex + 1}. {q.question_title}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                const optionNumber = i + 1;
                const isSelected = responses[q.question_id] === optionNumber;

                return (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition 
                      ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                          : "border-gray-300 dark:border-gray-700"
                      }
                    `}
                    onClick={() =>
                      handleOptionSelect(q.question_id, optionNumber)
                    }
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? "border-blue-600" : "border-gray-400"}
                      `}
                    >
                      {isSelected && (
                        <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                      )}
                    </span>

                    <span className="text-gray-800 dark:text-gray-200">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={previousQuestion}
                disabled={currentIndex === 0}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
              >
                Previous
              </button>

              <button
                onClick={nextQuestion}
                disabled={currentIndex === quiz.questions.length - 1}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Next
              </button>
            </div>

            {/* Submit */}
            <div className="mt-6 text-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
              >
                Submit Quiz
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
