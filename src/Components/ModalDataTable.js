import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import ExcelFile from '../DataFiles/Stocks.xlsx';
import { read, utils } from 'xlsx';
import '../App.css';

const ModalDataTable = (props) => {
    const { sliderValue, locationName } = props;

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

        //         setExcelToJsonData(jsonData);
        //     } catch (error) {
        //         console.error('Error reading Excel file:', error);
        //     }
        // };

        // const getProductsAndValues = async () => {
        //     try {
                const updatedData = jsonData.map((item) => {
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
                console.log(newProducts);

                const productValues = newProducts.map((key) =>
                    Math.ceil(filteredData[`${locationName}_${key}`])
                );

                setProductValue(productValues);
            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        };
        convertExcelToJson();
        // getProductsAndValues();
    }, []);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Date</th>
                    {product.map((item) => (
                        <th key={item}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        {sliderValue} {month} {year}
                    </td>
                    {productValue.map((item) => (
                        <td key={item}>{item}</td>
                    ))}
                </tr>
            </tbody>
        </Table>
    );
};

export default ModalDataTable;
