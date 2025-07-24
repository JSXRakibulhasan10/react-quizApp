import React, { useState, useCallback, useEffect } from "react";
import Question from "./Question.jsx";
import Summary from "./Summary.jsx";
import fetchQuestions from '../utils/fetchQuestions.js'

const Quiz = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuestion() {
      try {
        const fetched = await fetchQuestions(5,21);
        setQuestions(fetched)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadQuestion()
  }, [])


  //derived state
  const activeQuestionIndex = userAnswers.length;

  //another derived state that u decide wheter the quiz is over or not
  const quizIsComplete = questions.length > 0 && activeQuestionIndex >= questions.length;

  
const handelSelectAnswer = useCallback((selectedAnswer) => {
  console.log('Answer received in Quiz:', selectedAnswer, 'for question:', activeQuestionIndex);
  setUserAnswers((prevUserAnswers) => {
    return [...prevUserAnswers, selectedAnswer];
  });
}, []);

  const handleSkipAnswer = useCallback(
    () => handelSelectAnswer(null),
    [handelSelectAnswer]
  );

  if (loading) return <p>Loading questions....</p>
  if (error) return <p>Error: {error}</p>;

  if (quizIsComplete) {
    return (
      <Summary userAnswers={userAnswers} questions={questions} />
    );
  }

  return (
    <div id="quiz">
      <Question
      index={activeQuestionIndex}
      question={questions[activeQuestionIndex]}
        onSelectAnswer={handelSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  );
};

export default Quiz;
