import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function JoinQuizComponent() {
  const [quizLink, setQuizLink] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!quizLink) return alert("Please paste quiz link");

    const quizId = quizLink.split("/").pop();

    try {
      const res = await api.get(`/attempt/${quizId}/`);
      navigate(`/instructions/${quizId}`);
    } catch (err) {
      alert("Invalid or Expired Quiz Link: " + err.message);
    }
  };

  return (
    <div className="mt-5">
      <input
        type="text"
        className="border px-4 py-2 w-80"
        placeholder="Paste Quiz Link"
        onChange={(e) => setQuizLink(e.target.value)}
      />

      <button
        onClick={handleJoin}
        className="bg-green-600 text-white px-4 py-2 ml-2 rounded"
      >
        Register
      </button>
    </div>
  );
}
