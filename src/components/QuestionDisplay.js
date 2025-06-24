import React from "react";

export default function QuestionDisplay({ question, userAnswer, setUserAnswer }) {
  const { a, b, operator } = question;

  return (
    <div className="question-box">
      <pre className="math-display">
{`  ${a}
${operator} ${b}
-----
`}
      </pre>
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Enter your answer"
      />
    </div>
  );
}

