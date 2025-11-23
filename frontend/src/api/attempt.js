import api from "./axios";

export const saveAnswer = async (quizId, questionId, response) => {
  try {
    const res = await api.patch(`/api/v1/quiz/attempt/${quizId}/save/`, {
      question_id: questionId,
      response,
    });
    return res.data;
  } catch (error) {
    console.error("Error saving answer:", error);
    throw error;
  }
};

export const getQuizStatus = async (quizId) => {
  try {
    const res = await api.get(`/api/v1/quiz/attempt/${quizId}/status/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching quiz status:", error);
    throw error;
  }
};

export const submitQuiz = async (quizId) => {
  try {
    const res = await api.post(`/api/v1/quiz/attempt/${quizId}/submit/`);
    return res.data;
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
};
