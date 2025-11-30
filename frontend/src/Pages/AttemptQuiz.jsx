import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../components/HeaderUser";
import { useAuth } from "../context/AuthContext";
import TimerBar from "../components/TimerBar";
import QuizSidePanel from "../components/QuizSidePanel";
import axios from "../api/axios";
import GlobalLoader from "../components/GloblaLoader";
import { saveAnswer, getQuizStatus } from "../api/attempt";

export default function Attempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSubmitting = useRef(false);

  const SUBMIT_URL = `/api/v1/quiz/attempt/${quizId}/submit/`;

  // =====================================================
  // 1. Load quiz attempt
  // =====================================================
  useEffect(() => {
    axios
      .get(`/api/v1/quiz/attempt/${quizId}/`)
      .then((res) => {
        setQuiz(res.data);
        setResponses(res.data.responses || {});
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  // =====================================================
  // 2. Timer setup
  // =====================================================
  useEffect(() => {
    if (!quiz) return;

    const loadTimer = async () => {
      try {
        const status = await getQuizStatus(quizId);

        if (status.already_submitted) {
          navigate(`/result/${quizId}`);
          return;
        }

        if (!status.is_active || status.quiz_ended) {
          autoSubmit("quiz ended (status API)");
          return;
        }

        const startedAt = new Date(quiz.started_at).getTime();
        const timeLimitMs = quiz.time_limit_minutes * 60 * 1000;
        const quizEnd = new Date(quiz.ends_on).getTime();
        const nowServer = new Date(status.now).getTime();

        const attemptEnd = startedAt + timeLimitMs;
        const finalEnd = Math.min(attemptEnd, quizEnd);
        const remaining = Math.floor((finalEnd - nowServer) / 1000);

        if (remaining <= 0) {
          autoSubmit("time over on load");
          return;
        }

        setTimer({
          endTime: finalEnd,
          remaining,
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadTimer();
  }, [quiz]);

  // =====================================================
  // 3. Local countdown (AUTO SUBMIT HERE)
  // =====================================================
  useEffect(() => {
    if (!timer?.endTime) return;

    const interval = setInterval(() => {
      const diff = Math.floor((timer.endTime - Date.now()) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        autoSubmit("timer ended");
        return;
      }

      setTimer((prev) => ({ ...prev, remaining: diff }));
    }, 500);

    return () => clearInterval(interval);
  }, [timer?.endTime]);

  // =====================================================
  // 4. Backend polling (in case quiz ends early)
  // =====================================================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await getQuizStatus(quizId);

        if (status.quiz_ended && !isSubmitting.current) {
          autoSubmit("backend says quiz ended");
          return;
        }

        if (status.already_submitted) {
          navigate(`/result/${quizId}`);
          return;
        }
      } catch (err) {
        console.error("Status poll error", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [quizId]);

  // =====================================================
  // 5. Auto submit function (ONLY axios)
  // =====================================================
  const autoSubmit = async (reason) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    console.log("AUTO SUBMIT:", reason);

    try {
      await axios.post(SUBMIT_URL);
    } catch (err) {
      console.error("Auto-submit failed", err);
    }

    navigate(`/result/${quizId}`);
  };

  // =====================================================
  // 6. Manual submit
  // =====================================================
  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      await axios.post(SUBMIT_URL);
    } catch {}

    navigate(`/result/${quizId}`);
  };

  // =====================================================
  // 7. Save answers
  // =====================================================
const handleSave = async (questionId, answerNumber) => {
  try {
    await saveAnswer(quizId, questionId, answerNumber);
    setResponses((prev) => ({
      ...prev,
      [questionId]: answerNumber, // ALWAYS save selected number
    }));
  } catch (err) {
    console.log("save error", err);
  }
};



  // =====================================================
  // UI
  // =====================================================
 if (loading) return <GlobalLoader />;

  const q = quiz.questions[currentIndex];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <HeaderUser username={user.username} fullname={user.fullname} />

      <main className="relative flex flex-grow">
        <QuizSidePanel
          questions={quiz.questions}
          responses={responses}
          currentIndex={currentIndex}
          jumpTo={(i) => setCurrentIndex(i)}
        />

        <section className="flex-grow p-6 overflow-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">

        
         

            {/* TIMER */}
            {timer && timer.remaining > 0 && (
              <>
                <TimerBar
                  current={timer.remaining}
                  total={quiz.time_limit_minutes * 60}
                />
                <div className="text-right text-red-600 font-semibold mb-3">
                  ⏳ {Math.floor(timer.remaining / 60)}:
                  {String(timer.remaining % 60).padStart(2, "0")}
                </div>
              </>
            )}

            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Q{currentIndex + 1}. {q.question_title}
            </h2>

            <div className="space-y-4">
              {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                const num = i + 1;
                const selected = responses[q.question_id] === num;

                return (
                  <label
                    key={i}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer
                      ${selected
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                        : "border-gray-300 dark:border-gray-700"
                      }`}
                    onClick={() => handleSave(q.question_id, num)}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${selected
                          ? "border-blue-600"
                          : "border-gray-400 dark:border-gray-600"
                        }`}
                    >
                      {selected && (
                        <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                      )}
                    </span>

                    <span className="ml-3 dark:text-gray-200">{opt}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
              >
                Previous
              </button>

              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                disabled={currentIndex === quiz.questions.length - 1}
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
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
