// -----------------------------------------------------------------------------
// quiz.js — Quiz Attempt API Utilities
// -----------------------------------------------------------------------------
// This module provides helper functions for interacting with quiz attempt
// endpoints. It abstracts Axios requests into reusable functions.
// -----------------------------------------------------------------------------

import api from "./axios";

/**
 * Fetch an active quiz attempt for a given quiz ID.
 *
 * @param {string} quizId - Unique identifier of the quiz.
 * @returns {Promise<Object>} Attempt details returned by backend.
 *
 * @throws Any network/API error is allowed to propagate upward.
 */
export const getQuizAttempt = async (quizId) => {
  // No try/catch since we simply want to forward errors to the caller.
  const res = await api.get(`/api/v1/quiz/attempt/${quizId}/`);
  return res.data;
};
