import React, { useState } from "react";
import TopicSelector from "./components/TopicSelector";
import QuestionDisplay from "./components/QuestionDisplay";
import { generateQuestion } from "./utils/questionGenerator";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("addition");
  const [question, setQuestion] = useState(generateQuestion("addition"));
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
    setQuestion(generateQuestion(newTopic));
    setUserAnswer("");
    setFeedback("");
  };

  const handleSubmit = () => {
    if (parseFloat(userAnswer) === question.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong. Correct answer is ${question.answer}`);
    }
    setTimeout(() => {
      setQuestion(generateQuestion(topic));
      setUserAnswer("");
      setFeedback("");
    }, 2000);
  };

  return (
    <div className="app-container">
      <h1>Math Test App</h1>
      <TopicSelector topic={topic} onChange={handleTopicChange} />
      <QuestionDisplay question={question} userAnswer={userAnswer} setUserAnswer={setUserAnswer} />
      <button onClick={handleSubmit}>Submit</button>
      <p className="feedback">{feedback}</p>
    </div>
  );


}

export default App;

