import React from 'react';
import "../App.css"

const DaySlider = () => {
    return (
        <>
        <h3>Select Day of Schedule</h3>
        <div className="DaySlider">
            <input
                type="range"
                min="1"
                max="31"
                className="slider"
                id="myRange"
            ></input>
            <p>
                Day: <span id="demo"></span>
            </p>
        </div>
        </>
    );
};

export default DaySlider;
