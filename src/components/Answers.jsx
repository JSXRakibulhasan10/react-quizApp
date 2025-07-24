import React, { useRef, useEffect } from "react";

const Answers = ({ answers, selectedAnswer, answerState, onSelect }) => {
  const shuffledAnswers = useRef([]);

  // Reset shuffle every time answers prop changes
  useEffect(() => {
    shuffledAnswers.current = [...answers].sort(() => Math.random() - 0.5);
  }, [answers]);

  return (
    <ul id="answers">
      {shuffledAnswers.current.map((ans) => {
        const isSelected = selectedAnswer === ans;
        let cssClasses = "";

        if (answerState === "answered" && isSelected) {
          cssClasses = "selected";
        }

        if ((answerState === "correct" || answerState === "wrong") && isSelected) {
          cssClasses = answerState;
        }

        return (
          <li key={ans} className="answer">
            <button onClick={() => onSelect(ans)} className={cssClasses} disabled={answerState != ''}>
              {ans}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Answers;

