import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import TopicSelector from "./components/TopicSelector";
import QuestionDisplay from "./components/QuestionDisplay";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ResultsPage from "./components/ResultsPage";
import SessionSummaryPage from "./components/SessionSummaryPage";
import { generateQuestion } from "./utils/questionGenerator";
import { ResultTracker } from "./utils/ResultTracker";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./App.css";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState("addition");
  const [difficulty, setDifficulty] = useState("easy");
  const [question, setQuestion] = useState(generateQuestion("addition", "easy"));
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [tracker, setTracker] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      const newTracker = new ResultTracker("Math Stage 1");
      newTracker.startNextQuestion();
      setTracker(newTracker);
    }
  }, [user]);

  // ✅ Automatically update question whenever topic or difficulty changes
  useEffect(() => {
    if (user) {
      const newQuestion = generateQuestion(topic, difficulty);
      setQuestion(newQuestion);
      setUserAnswer("");
      setFeedback("");
      setQuestionCount(0);
      if (tracker) tracker.startNextQuestion();
    }
  }, [topic, difficulty]); // <-- re-run whenever topic or difficulty changes

  const handleTopicChange = (newTopic) => {
    setTopic(newTopic); // no need to call generateQuestion here anymore
  };

  const handleSubmit = () => {
    const currentQuestion = question;
    const isCorrect = parseFloat(userAnswer) === currentQuestion.answer;

    const questionRecord = {
      questionText: currentQuestion.text,
      correctAnswer: currentQuestion.answer,
      userAnswer: userAnswer,
      topic: topic,
    };

    if (tracker) tracker.recordQuestion(questionRecord);

    setFeedback(isCorrect ? "✅ Correct!" : `❌ Wrong. Correct answer is ${currentQuestion.answer}`);
    setQuestionCount((prev) => prev + 1);

    setTimeout(() => {
      setQuestion(generateQuestion(topic, difficulty));
      setUserAnswer("");
      setFeedback("");
      if (tracker) tracker.startNextQuestion();
    }, 2000);
  };

  const finishTest = () => {
    if (!tracker) return;
    const resultData = tracker.finish();
    navigate("/session-summary", { state: { result: resultData } });
  };

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  return (
    <div className="app-container">
      <h1>Home Tutor App</h1>

      <nav style={{ marginBottom: "1rem" }}>
        {user && <button onClick={handleLogout}>Logout</button>}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <>
                <TopicSelector
                  topic={topic}
                  difficulty={difficulty}
                  onTopicChange={handleTopicChange}
                  onDifficultyChange={setDifficulty}
                />

                <QuestionDisplay
                  question={question}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                />
                <button onClick={handleSubmit}>Submit</button>
                <p className="feedback">{feedback}</p>

                {questionCount >= 10 && (
                  <button onClick={finishTest}>View Summary</button>
                )}
              </>
            ) : (
              <>
                <LoginForm onLogin={setUser} />
                <RegisterForm onRegister={setUser} />
              </>
            )
          }
        />
        <Route path="/session-summary" element={<SessionSummaryPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

