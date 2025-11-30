// -----------------------------------------------------------------------------
// attempt.js — Quiz Attempt API Helpers
// -----------------------------------------------------------------------------
// Centralized functions for saving answers, checking quiz status,
// and submitting a completed quiz.
//
// All functions use the shared axios instance (api) which includes
// credentials + CSRF + baseURL settings.
// -----------------------------------------------------------------------------

import api from "./axios";

// -----------------------------------------------------------------------------
// Save a single answer during the quiz attempt
// -----------------------------------------------------------------------------
// quizId        → ID of the quiz being attempted
// questionId    → ID of the question being answered
// selectedOption → The user's selected option number (1–4)
// -----------------------------------------------------------------------------
export const saveAnswer = async (quizId, questionId, selectedOption) => {
  try {
    const res = await api.patch(`/api/v1/quiz/attempt/${quizId}/save/`, {
      question_id: questionId,
      selected_option: selectedOption,
    });
    return res.data;
  } catch (error) {
    console.error("Error saving answer:", error);
    throw error;
  }
};

// -----------------------------------------------------------------------------
// Get real-time quiz attempt status
// -----------------------------------------------------------------------------
// Useful when resuming a quiz or validating whether the quiz is still open.
// -----------------------------------------------------------------------------
export const getQuizStatus = async (quizId) => {
  try {
    const res = await api.get(`/api/v1/quiz/attempt/${quizId}/status/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching quiz status:", error);
    throw error;
  }
};

// -----------------------------------------------------------------------------
// Submit final quiz and lock further attempts
// -----------------------------------------------------------------------------
// Called when the user finishes the quiz or time runs out.
// -----------------------------------------------------------------------------
export const submitQuiz = async (quizId) => {
  try {
    const res = await api.post(`/api/v1/quiz/attempt/${quizId}/submit/`);
    return res.data;
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};
