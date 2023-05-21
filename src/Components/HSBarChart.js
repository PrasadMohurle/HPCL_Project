import React, { useState, useEffect } from 'react';
import HSBar from 'react-horizontal-stacked-bar-chart';
import csvToJson from 'csvtojson';
import data from './data.csv';

const HSBarChart = () => {
    const [todayData, setTodayData] = useState([]);
    const [tomorrowData, setTomorrowData] = useState([]);
    // let updatedData = [];
    const [sliderValue, setSliderValue] = useState(1);

    useEffect(() => {
        // console.log(`${sliderValue + 1}`);
        // console.log('typeOf', typeof sliderValue);
        let updatedData = [];

        function determineSliderValue() {
            var slider = document.getElementById('myRange');
            var output = document.getElementById('demo');
            setSliderValue(slider.value);
            output.innerHTML = sliderValue;
            slider.value = sliderValue;

            slider.oninput = function () {
                // this is like a onchange function
                let parsedDay = parseInt(this.value);
                output.innerHTML = this.value;
                // console.log(this.value);
                // console.log(typeof this.value);

                setTodayData(
                    updatedData.filter((item) => item.day === `${parsedDay}`)
                );

                setTomorrowData(
                    updatedData.filter(
                        (item) => item.day === `${parsedDay + 1}`
                    )
                );
            };
        }
        determineSliderValue();

        async function loadCsvData() {
            const response = await fetch(data);
            const csvData = await response.text();
            // console.log(csvData);
            const json = await csvToJson().fromString(csvData);
            // console.log(json);
            updatedData = json.map((item) => ({
                ...item,
                value: parseInt(item.value),
            }));
            setTodayData(updatedData.filter((item) => item.day === '1'));
            setTomorrowData(updatedData.filter((item) => item.day === '2'));
            // console.log(updatedData);
        }
        loadCsvData();
    }, [sliderValue]);

    return (
        <>
            <div id="hsbarChart">
                <div className="legend">
                    <div className="holiday">
                        <span>No Data</span>
                    </div>
                    <div className="Diesel">
                        <span>Diesel</span>
                    </div>
                    <div className="Petrol">
                        <span>Pertol</span>
                    </div>
                    <div className="Kerosene">
                        <span>Kerosene</span>
                    </div>
                </div>
                <h4>Today</h4>
                <HSBar
                    id="hsbarToday"
                    data={todayData}
                    height={40}
                    outlineWidth={0.1}
                    outlineColor="black"
                    showValueIn
                />
            </div>

            <div id="hsbarChart">
                <h4>Tomorrow</h4>
                <HSBar
                    id="hsbarTomorrow"
                    data={tomorrowData}
                    height={40}
                    outlineWidth={0.1}
                    outlineColor="black"
                    showValueIn
                />
            </div>
        </>
    );
};

export default HSBarChart;
