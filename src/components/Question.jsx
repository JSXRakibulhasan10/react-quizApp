import React, { useState, useEffect } from "react";
import QuestionTimer from "./QuestionTimer";
import Answers from "./Answers";

const Question = ({ index, question, onSelectAnswer, onSkipAnswer }) => {
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null,
  });

  // Reset answer state when question changes - FIXED: Only reset when question actually changes
  useEffect(() => {
    setAnswer({
      selectedAnswer: "",
      isCorrect: null,
    });
  }, [question?.id || index]); // Use question.id if available, fallback to index

  // Timer changes based on state to create the "drain effect"
  let timer = 20000; // Default 20 seconds for new question

  if (answer.selectedAnswer && answer.isCorrect === null) {
    timer = 1000; // 1 second - shows selection, then drains quickly
  }

  if (answer.isCorrect !== null) {
    timer = 2000; // 2 seconds - shows result, then drains to next question
  }

  const handleSelectAnswer = (selectedAnswer) => {
    // Prevent multiple selections
    if (answer.selectedAnswer) {
      return;
    }

    // Set selected answer immediately
    setAnswer({
      selectedAnswer: selectedAnswer,
      isCorrect: null,
    });

    // After 1 second, show if it's correct/wrong
    const correctnessTimer = setTimeout(() => {
      setAnswer({
        selectedAnswer: selectedAnswer,
        isCorrect: question?.answers?.[0] === selectedAnswer,
      });

      // After another 2 seconds, move to next question
      const nextQuestionTimer = setTimeout(() => {
        onSelectAnswer(selectedAnswer);
      }, 2000);

      // Store timer ID for cleanup if needed
      return () => clearTimeout(nextQuestionTimer);
    }, 1000);

    // Store timer ID for cleanup if needed
    return () => clearTimeout(correctnessTimer);
  };

  // Determine answer state for styling
  let answerState = "";
  if (answer.selectedAnswer && answer.isCorrect !== null) {
    answerState = answer.isCorrect ? "correct" : "wrong";
  } else if (answer.selectedAnswer) {
    answerState = "answered";
  }

  // Don't render if question is not available
  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div id="question">
      <QuestionTimer
        key={index} // Force remount for each new question
        timeout={timer}
        onTimeOut={answer.selectedAnswer === '' ? onSkipAnswer : null}
        mode={answerState}
      />
      <h2>{question.text}</h2>
      <Answers
        answers={question.answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
};

export default Question;