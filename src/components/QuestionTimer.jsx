import React, { useEffect, useState } from "react";

const QuestionTimer = ({ timeout, onTimeOut, mode }) => {
  const [remainingTime, setRemainingTime] = useState(timeout);

  useEffect(() => {
    console.log("SETTING TIMEOUT");

    const timer = setTimeout(onTimeOut, timeout);

    //this is also a cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeOut]);

  useEffect(() => {
    console.log("SETTING INTERVAL");

    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);

    //this is a cleanup function which prevents this useEffect from running twice which it is doing
    return () => {
      clearInterval(interval);
    };
  }, []);

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
