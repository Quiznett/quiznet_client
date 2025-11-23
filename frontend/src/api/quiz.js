import api from "./axios";

export const getQuizAttempt = async (quizId) => {
  try {
    const res = await api.get(`/api/v1/quiz/attempt/${quizId}/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching quiz attempt:", error);
    throw error;
  }
};
