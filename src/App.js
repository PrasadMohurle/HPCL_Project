import React, { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HSBarChart from './Components/HSBarChart';
import DaySlider from './Components/DaySlider';
import OilDepot from './Components/OilDepot';

function App() {
    return (
        <Fragment>
            <div className="wrapper">
                <h1>Pipeline Scheduler</h1>
                <OilDepot></OilDepot>
                <HSBarChart></HSBarChart>
                {/* <DaySlider></DaySlider> */}
            </div>
        </Fragment>
    );
}

export default App;
