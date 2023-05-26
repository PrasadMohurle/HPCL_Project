import React, { useState, useEffect } from 'react';
import HSBar from 'react-horizontal-stacked-bar-chart';
import { read, utils } from 'xlsx';
import ExcelFile from '../DataFiles/ScheduleMainPipeline.xlsx';

const HSBarChart = () => {
    const [todayData, setTodayData] = useState([]);
    const [tomorrowData, setTomorrowData] = useState([]);
    const [sliderValue, setSliderValue] = useState(1);

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

    return (
        <>
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
                <h4>
                    {sliderValue + 1} {month} {year}
                </h4>
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
                <input
                    type="range"
                    min="1"
                    max="31"
                    className="slider"
                    value={sliderValue}
                    onChange={handleSliderChange}
                ></input>
                <p>
                    Day: {sliderValue} {month} {year}
                </p>
            </div>
        </>
    );
};

export default HSBarChart;
