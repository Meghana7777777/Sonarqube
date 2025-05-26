import React, { useEffect, useState } from 'react'


const formatTime = () => {
    const now = new Date();
    return <div className="time-display">
        <div className='number-box' key='h'><span className="counter-digit">{now.getHours()}</span> <span className="counter-divider">:</span> </div>
        <div className='number-box' key='m'>  <span className="counter-digit">{now.getMinutes()}</span> <span className="counter-divider">:</span>  </div>
        <div className='number-box' key='s'>  <span className="counter-digit">{now.getSeconds()}</span></div>
    </div>
};

const CurrentTimeRendering = () => {
    const [currentTime, setCurrentTime] = useState<JSX.Element>(formatTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(formatTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return <>
        {currentTime}
    </>
}

export default CurrentTimeRendering