import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Takequiz.css";

const TakeQuiz = () => {
  const { quizId } = useParams(); // Extract quizId from URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/signin");
        return;
    }

    try {
        const response = await axios.post(
            `/api/quizzes/${quizId}/submit`,
            { answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({ questionId, selectedOption })) },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const { score, percentageScore, passed, message } = response.data;
        toast.success(message);
        navigate(`/quiz-result/${quizId}`, { state: { score, percentageScore, passed } });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        toast.error("Failed to submit quiz");
    } finally {
        setSubmitting(false);
    }
};

  if (loading) return <p>Loading quiz...</p>;

  return (
    <div className="quiz-container">
      <div className="header-group">
        <h2 className="heading-main">{quiz?.title}</h2>
        <p>{quiz?.description}</p>
      </div>

      {quiz?.questions?.map((question, index) => (
        <div key={question._id} className="question-card">
          <h4 className="question">
            {index + 1}. {question.questionText}
          </h4>
          <ul className="option-list">
            {question.options.map((option) => (
              <li key={option._id} className="options">
                <label>
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option._id}
                    checked={selectedAnswers[question._id] === option._id}
                    onChange={() =>
                      handleOptionSelect(question._id, option._id)
                    }
                  />
                  {option.text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        className="quiz-submit-btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
};

export default TakeQuiz;




