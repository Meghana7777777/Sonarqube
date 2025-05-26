import React, { useState, useEffect } from 'react';

// Define the type for the props
interface TimerProps {
    startTime: Date;
}

const Timer: React.FC<TimerProps> = ({ startTime }) => {
    const [time, setTime] = useState<number>(0); // Track total seconds elapsed
    const [isActive, setIsActive] = useState<boolean>(true); // Timer starts automatically when component mounts

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            // Ensure only one interval is running at a time
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000); // Updates every 1 second
        }

        // Cleanup the interval when the timer is not active or the component unmounts
        return () => clearInterval(interval);
    }, [isActive]); // Only re-run this effect when isActive changes

    // Calculate the initial difference from the start time
    const startTimestamp = startTime.getTime();
    const currentTime = Date.now();
    const initialTimeDifference = Math.floor((currentTime - startTimestamp) / 1000); // time difference in seconds

    //   console.log(startTime);
    //   console.log(currentTime);
    // Add the initial time difference to the current time value
    const currentElapsedTime = initialTimeDifference;

    // Convert total seconds into hours, minutes, and seconds
    const hours = Math.floor(currentElapsedTime / 3600);
    const minutes = Math.floor((currentElapsedTime % 3600) / 60);
    const seconds = currentElapsedTime % 60;

    // Format the time as HH:MM:SS
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const handleStop = () => {
        setIsActive(false); // Stop the timer
    };

    return (
        <div>
            {formattedTime}
        </div>
    );
};

export default Timer;
