import React, { useState, useEffect } from 'react';
import HSBar from 'react-horizontal-stacked-bar-chart';
import ExcelFile from '../DataFiles/ScheduleMainPipeline.xlsx';
import OilDepot from './OilDepot';
import { read, utils } from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import TableView from './TableView';
// import './TableView.css';
import DemoTable from './DemoTable';
import './DemoTable.css';
// import ExcelFile from '../DataFiles/SolnV3.xlsx';
// import ExcelFile from '../DataFiles/Stocks.xlsx';

const HSBarChart = () => {
    const [todayData, setTodayData] = useState([]);
    const [tomorrowData, setTomorrowData] = useState([]);
    const [sliderValue, setSliderValue] = useState(new Date().getDate());

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const month = months[new Date().getMonth()];
    const year = new Date().getFullYear();
    // const date = new Date().getDate()

    useEffect(() => {
        const convertExcelToJson = async () => {
            try {
                const response = await fetch(ExcelFile);
                const data = await response.arrayBuffer();
                const workbook = read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonOptions = { defval: 0, blankrows: true };

                const jsonData = utils.sheet_to_json(worksheet, jsonOptions);

                const updatedData = jsonData.map((item) => {
                    let color;
                    switch (item.PRODUCT_CODE) {
                        case 'H6':
                            color = '#BB6BD9';
                            break;
                        case 'H4':
                            color = '#ffa835';
                            break;
                        case 'M6':
                            color = '#E44E3A';
                            break;
                        case 'K':
                            color = '#45D645';
                            break;
                        case 'LAN':
                            color = '#5145d6';
                            break;
                        default:
                            color = '#474747';
                    }

                    return {
                        value: Math.floor(item.QUANTITY),
                        name: item.PRODUCT_CODE,
                        day: item.SCHEDULE_DAY + 1,
                        color: color,
                    };
                });

                setTodayData(
                    updatedData.filter((item) => item.day === sliderValue)
                );
                setTomorrowData(
                    updatedData.filter((item) => item.day === sliderValue + 1)
                );
            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        };

        convertExcelToJson();
    }, [sliderValue]);

    const handleSliderChange = (event) => {
        const parsedDay = parseInt(event.target.value);
        setSliderValue(parsedDay);
    };

    const handlePreviousButtonClick = () => {
        if (sliderValue > 1) {
            setSliderValue((prevValue) => prevValue - 1);
        }
    };

    const handleNextButtonClick = () => {
        if (sliderValue < 31) {
            setSliderValue((prevValue) => prevValue + 1);
        }
    };

    return (
        <>
            <OilDepot sliderValue={sliderValue}></OilDepot>

            <div className="legend">
                <div className="holiday">
                    <span>No Data</span>
                </div>
                <div className="Naptha">
                    <span>LAN</span>
                </div>
                <div className="H6">
                    <span>H6</span>
                </div>
                <div className="H4">
                    <span>H4</span>
                </div>
                <div className="M6">
                    <span>M6</span>
                </div>
                <div className="Kerosene">
                    <span>K</span>
                </div>
            </div>
            <div id="hsbarChart">
                <h4>
                    {sliderValue} {month} {year}
                </h4>
                <HSBar
                    id="hsbarToday"
                    data={todayData}
                    height={40}
                    outlineWidth={4}
                    outlineColor="black"
                    showValueIn
                />
            </div>

            <div id="hsbarChart">
                {sliderValue === 31 ? (
                    <h4>
                        {sliderValue} {month} {year}
                    </h4>
                ) : (
                    <h4>
                        {sliderValue + 1} {month} {year}
                    </h4>
                )}
                <HSBar
                    id="hsbarTomorrow"
                    data={tomorrowData}
                    height={40}
                    outlineWidth={4}
                    outlineColor="black"
                    showValueIn
                />
            </div>

            <div className="DaySlider">
                <div className="slider-container">
                    <button
                        className="slider-btn left-btn"
                        onClick={handlePreviousButtonClick}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <input
                        type="range"
                        min="1"
                        max="31"
                        className="slider"
                        value={sliderValue}
                        onChange={handleSliderChange}
                    ></input>
                    <button
                        className="slider-btn right-btn"
                        onClick={handleNextButtonClick}
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
                <p>
                    Day: {sliderValue} {month} {year}
                </p>
            </div>

            <div className="fillLine-Table">
                <div>
                    <h4>
                        {sliderValue} {month} {year} Table
                    </h4>
                    <DemoTable data={todayData} />
                </div>
                <div>
                    {sliderValue === 31 ? (
                        <h4>
                            {sliderValue} {month} {year} Table
                        </h4>
                    ) : (
                        <h4>
                            {sliderValue + 1} {month} {year} Table
                        </h4>
                    )}

                    <DemoTable data={tomorrowData} />
                </div>
            </div>
        </>
    );
};

export default HSBarChart;
