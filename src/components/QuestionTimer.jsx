import React, { useEffect, useState } from "react";

const QuestionTimer = ({ timeout, onTimeOut, mode }) => {
  const [remainingTime, setRemainingTime] = useState(timeout);

  // Reset remaining time when timeout changes (new question)
  useEffect(() => {
    setRemainingTime(timeout);
  }, [timeout]);

  // Handle timeout - this creates the "drain effect" when timeout changes
  useEffect(() => {
    if (!onTimeOut) return; // Don't set timeout if no callback
    
    console.log("SETTING TIMEOUT");
    const timer = setTimeout(onTimeOut, timeout);
    
    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeOut]);

  // Handle countdown interval
  useEffect(() => {
    console.log("SETTING INTERVAL");
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        if (prevRemainingTime <= 0) {
          return 0;
        }
        return prevRemainingTime - 100;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [timeout]); // Reset interval when timeout changes - this is key!

  return (
    <>
      <progress
        className={mode}
        id="question-time"
        max={timeout}
        value={remainingTime}
      />
    </>
  );
};

export default QuestionTimer;