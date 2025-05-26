import React, { useState, useEffect } from 'react';
import './timer-component.css';

export interface ICountDownTimerProps {
  timer: number;
  timerUpHandler : () => void;
}
const CountdownTimer = (props: ICountDownTimerProps) => {
  const [timer, setTimer] = useState(0); // 5 minutes in seconds

  useEffect(() => {
    setTimer(props.timer);
    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          // Trigger API call when timer reaches 0
          clearInterval(intervalId);
          // Replace the following line with your actual API call
          // Example: fetch('your-api-endpoint', { method: 'POST' });
          setTimeout(() => props.timerUpHandler(), 0);
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="timer">
        <div className="box"><p>{formatTime(timer)}</p></div>
      
    </div>
  );
};

export default CountdownTimer;
