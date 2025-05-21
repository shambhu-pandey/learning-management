import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, percentageScore, passed } = location.state || {};

    if (!location.state) {
        navigate("/dashboard");
        return null;
    }

    return (
        <div className="quiz-result-container">
            <h2>Quiz Results</h2>
            <p>Score: {score}</p>
            <p>Percentage: {percentageScore.toFixed(2)}%</p>
            <p>Status: {passed ? "Passed" : "Failed"}</p>
            <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
    );
};

export default QuizResult;



// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const QuizResult = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { attempt, questions } = location.state || {};

//     if (!attempt || !questions) {
//         return (
//             <div className="error-container">
//                 <h2>Error</h2>
//                 <p>Quiz results could not be loaded. Please try again.</p>
//                 <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-result-container">
//             <h2>Quiz Results</h2>
//             <p>Score: {attempt.score}</p>
//             <p>Percentage: {attempt.percentageScore.toFixed(2)}%</p>
//             <p>Status: {attempt.passed ? "Passed" : "Failed"}</p>

//             <h3>Solutions</h3>
//             {questions.map((question, index) => (
//                 <div key={question._id} className="question-card">
//                     <h4>{index + 1}. {question.questionText}</h4>
//                     <ul>
//                         {question.options.map((option) => (
//                             <li key={option._id} style={{ color: option.isCorrect ? "green" : "red" }}>
//                                 {option.text} {option.isCorrect && "(Correct)"}
//                             </li>
//                         ))}
//                     </ul>
//                     <p>Your Answer: {attempt.answers.find(a => a.questionId === question._id)?.selectedOption}</p>
//                 </div>
//             ))}

//             <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
//         </div>
//     );
// };

// export default QuizResult;