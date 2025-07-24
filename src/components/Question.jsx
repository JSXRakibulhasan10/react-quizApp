import React, { useState, useEffect } from "react";
import QuestionTimer from "./QuestionTimer";
import Answers from "./Answers";
import QUESTIONS from "../questions";

const Question = ({ index, onSelectAnswer, onSkipAnswer }) => {
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null,
  });

  // Reset answer state when question index changes
  useEffect(() => {
    setAnswer({
      selectedAnswer: "",
      isCorrect: null,
    }); 
  }, [index]);

  let timer = 20000 ;

  if(answer.selectedAnswer) {
    timer = 1000;
  }

  if(answer.isCorrect !== null){
    timer = 2000;
  }

  const handleSelectAnswer = (selectedAnswer) => {
    setAnswer({
      selectedAnswer: selectedAnswer,
      isCorrect: null,
    });

    setTimeout(() => {
      setAnswer({
        selectedAnswer: selectedAnswer,
        isCorrect: QUESTIONS[index].answers[0] === selectedAnswer,
      });
      
      setTimeout(() => {
        onSelectAnswer(selectedAnswer);
      }, 2000);
    }, 1000);
  };

  let answerState = "";
  if (answer.selectedAnswer && answer.isCorrect !== null) {
    answerState = answer.isCorrect ? "correct" : "wrong";
  } else if (answer.selectedAnswer) {
    answerState = "answered"; // or whatever state you want for pending
  }

  return (
    <div id="question">
      <QuestionTimer
        key={timer} // This will force remount when index changes
        timeout={timer}
        onTimeOut={ answer.selectedAnswer === '' ? onSkipAnswer : null}
        mode={answerState}
      />
      <h2>{QUESTIONS[index].text}</h2>
      <Answers
        answers={QUESTIONS[index].answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
};

export default Question;