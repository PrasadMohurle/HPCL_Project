import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import '../App.css';

const ModalDataTable = (props) => {
    const { sliderValue, locationName, jsonDataFromExcel, fileName } = props;

    // const [excelToJsonData, setExcelToJsonData] = useState({});
    const [product, setProduct] = useState([]);
    const [productValue, setProductValue] = useState([]);

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

    const readingStockData = async () => {
        // console.log('Stock Data', jsonDataFromExcel);
        try {
            const updatedData = jsonDataFromExcel.map((item) => {
                const excelDate = item.DATE_OF_DEMAND;
                const millisecondsPerDay = 24 * 60 * 60 * 1000;
                const excelStartDate = new Date(1904, 0, 1); // Excel's start date
                const dateValue = new Date(
                    excelStartDate.getTime() +
                        (excelDate - 1) * millisecondsPerDay
                );

                const formattedDate = parseInt(`${dateValue.getDate()}`);

                if (formattedDate === sliderValue) {
                    return item;
                }
                return null;
            });

            const dataOnDate = updatedData[sliderValue];

            const filteredData = {};
            for (let key in dataOnDate) {
                if (key.startsWith(locationName)) {
                    filteredData[key] = dataOnDate[key];
                }
            }

            const newProducts = [];
            for (let key in filteredData) {
                var productNames = key.split('_');

                if (productNames.length < 3) {
                    newProducts.push(productNames[1]);
                }
            }
            setProduct(newProducts);

            const productValues = newProducts.map((key) =>
                Math.ceil(filteredData[`${locationName}_${key}`])
            );
            setProductValue(productValues);
        } catch (error) {
            console.error('Error reading JSON Data:', error);
        }
    };

    const readingTankageData = async () => {
        try {
            // console.log('Tankage Data', jsonDataFromExcel);

            const TankageData = jsonDataFromExcel[0];

            const filteredDataOnLocation = {};
            for (let key in TankageData) {
                if (key.startsWith(locationName)) {
                    filteredDataOnLocation[key] = TankageData[key];
                }
            }
            // console.log(filteredDataOnLocation);

            const newProducts = [];
            for (let key in filteredDataOnLocation) {
                var productNames = key.split('_');

                if (productNames.length < 3) {
                    newProducts.push(productNames[1]);
                }
            }
            setProduct(newProducts);

            const productValues = newProducts.map((key) =>
                Math.ceil(filteredDataOnLocation[`${locationName}_${key}`])
            );
            setProductValue(productValues);
        } catch (error) {
            console.error('Error reading JSON Data:', error);
        }
    };

    const readingDemandData = async () => {
        try {
            // console.log('Demand Data', jsonDataFromExcel);

            const updatedData = jsonDataFromExcel.map((item) => {
                const excelDate = item.DATE_OF_DEMAND;
                const millisecondsPerDay = 24 * 60 * 60 * 1000;
                const excelStartDate = new Date(1904, 0, 1); // Excel's start date
                const dateValue = new Date(
                    excelStartDate.getTime() +
                        (excelDate - 1) * millisecondsPerDay
                );

                const formattedDate = parseInt(`${dateValue.getDate()}`);

                if (formattedDate === sliderValue) {
                    return item;
                }
                return null;
            });

            const dataOnDate = updatedData[sliderValue - 1];

            const filteredData = {};
            for (let key in dataOnDate) {
                if (key.startsWith(locationName)) {
                    filteredData[key] = dataOnDate[key];
                }
            }

            const newProducts = [];
            for (let key in filteredData) {
                var productNames = key.split('_');

                if (productNames.length < 3) {
                    newProducts.push(productNames[1]);
                }
            }
            setProduct(newProducts);

            const productValues = newProducts.map((key) =>
                Math.ceil(filteredData[`${locationName}_${key}`])
            );
            setProductValue(productValues);
        } catch (error) {
            console.error('Error reading JSON Data:', error);
        }
    };

    const readingDroppingData = async () => {
        try {
            // console.log('Dropping Data', jsonDataFromExcel);

            const updatedData = jsonDataFromExcel.map((item) => {
                const excelDate = item.SCHEDULE_DAY;

                if(excelDate === sliderValue){
                    return item;
                }
                return null;
            })

            // console.log(updatedData);

            const dataOnDate = updatedData[sliderValue];

            // console.log(dataOnDate);

            const filteredData = {};
            for (let key in dataOnDate) {
                if (key.startsWith(locationName)) {
                    filteredData[key] = dataOnDate[key];
                }
            }

            const newProducts = [];
            for (let key in filteredData) {
                var productNames = key.split('_');

                if (productNames.length < 3) {
                    newProducts.push(productNames[1]);
                }
            }
            setProduct(newProducts);

            const productValues = newProducts.map((key) =>
                Math.ceil(filteredData[`${locationName}_${key}`])
            );
            setProductValue(productValues);

        } catch (error) {
            console.error('Error reading JSON Data:', error);
        }
    };

    useEffect(() => {
        switch (fileName) {
            case 'Stock':
                readingStockData();
                break;
            case 'Tankage':
                readingTankageData();
                break;
            case 'Demand':
                readingDemandData();
                break;
            case 'Dropping':
                readingDroppingData();
                break;
            default:
        }
    },// eslint-disable-next-line
     [jsonDataFromExcel]);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Date</th>
                    {product.map((item, index) => (
                        <th key={index}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        {sliderValue} {month} {year}
                    </td>
                    {productValue.map((item, index) => (
                        <td key={index}>{item}</td>
                    ))}
                </tr>
            </tbody>
        </Table>
    );
};

export default ModalDataTable;
