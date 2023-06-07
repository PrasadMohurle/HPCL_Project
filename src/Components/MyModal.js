import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import ResponsiveGraph from './ResponsiveGraph';
import ModalDataTable from './ModalDataTable';
import stocksData from '../DataFiles/Stocks.xlsx';
import tankageData from '../DataFiles/Tankage.xlsx';
import droppingData from '../DataFiles/Dropping.xlsx';
import demandData from '../DataFiles/Demand.xlsx';
import { read, utils } from 'xlsx';

import '../App.css';

function MyModal(props) {
    const [filteredStockDataOnLocation, setFilteredStockDataOnLocation] =
        useState([]);
    const [filteredTankageDataOnLocation, setFilteredTankageDataOnLocation] =
        useState([]);

    const [jsonDataFromExcel, setsonDataFromExcel] = useState([]);
    const [fileName, setFileName] = useState('');

    const [activeButton, setActiveButton] = useState(null);

    const { show, handleClose, locationName, jsonDataStocks, jsonDataTankage } =
        props;

    var tankageDataArray = [];

    function extractingStockDataOnLocation() {
        const locationData = [];
        for (const key in jsonDataStocks[0]) {
            if (key.startsWith(locationName)) {
                locationData[key] = jsonDataStocks[0][key];
            }
        }

        const newProducts = [];
        for (let key in locationData) {
            var productNames = key.split('_');

            if (productNames.length < 3) {
                newProducts.push(productNames[1]);
            }
        }

        const productValues = newProducts.map((key) =>
            Math.ceil(locationData[`${locationName}_${key}`])
        );

        //  console.log(productValues);
        return productValues;
    }

    function extractingTankageDataOnLocation() {
        // console.log(jsonDataTankage);

        tankageDataArray.push(jsonDataTankage);

        // console.log(tankageData);

        const locationData = [];
        for (const key in tankageDataArray[0]) {
            if (key.startsWith(locationName)) {
                locationData[key] = tankageDataArray[0][key];
            }
        }
        // console.log(locationData);

        const newProducts = [];
        for (let key in locationData) {
            var productNames = key.split('_');

            if (productNames.length < 3) {
                newProducts.push(productNames[1]);
            }
        }

        const productValues = newProducts.map((key) =>
            Math.ceil(locationData[`${locationName}_${key}`])
        );

        return productValues;
    }

    function activeButtonHandler() {
        const buttons = document.querySelectorAll('.button');

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    useEffect(() => {
        setFilteredStockDataOnLocation(extractingStockDataOnLocation());
        setFilteredTankageDataOnLocation(extractingTankageDataOnLocation());
        activeButtonHandler();
    },// eslint-disable-next-line
     [jsonDataStocks, locationName]);

    // console.log("stock",filteredStockDataOnLocation);
    // console.log("tankge",filteredTankageDataOnLocation);

    var filteredDataOnLocation = [
        ...filteredStockDataOnLocation,
        ...filteredTankageDataOnLocation,
    ];

    // console.log(filteredDataOnLocation);

    async function convertExcelToJson(excelData, file) {
        if (fileName !== file) {
            setFileName(file);
            try {
                const response = await fetch(excelData);
                const data = await response.arrayBuffer();
                const workbook = read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonOptions = { defval: 0, blankrows: true };
                const jsonData = utils.sheet_to_json(worksheet, jsonOptions);
                // console.log(jsonData);

                setsonDataFromExcel(jsonData);
            } catch (error) {
                console.error('Error reading Excel file:', error);
            }
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                animation={false}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Product Details of {locationName}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal_body">
                    <div className="modal-graph">
                        {filteredDataOnLocation.map((data, index) => (
                            <ResponsiveGraph data={data} key={index} />
                        ))}
                    </div>
                    <div className="modal-btns-list">
                        <button
                            className={`modal-btn ${
                                activeButton === 'Stock' ? 'active' : ''
                            }`}
                            onClick={() => {
                                setActiveButton('Stock');
                                convertExcelToJson(stocksData, 'Stock');
                            }}
                        >
                            Stock
                        </button>
                        <button
                            className={`modal-btn ${
                                activeButton === 'Tankage' ? 'active' : ''
                            }`}
                            onClick={() => {
                                setActiveButton('Tankage');
                                convertExcelToJson(tankageData, 'Tankage');
                            }}
                        >
                            Tankage
                        </button>
                        <button
                            className={`modal-btn ${
                                activeButton === 'Demand' ? 'active' : ''
                            }`}
                            onClick={() => {
                                setActiveButton('Demand');
                                convertExcelToJson(demandData, 'Demand');
                            }}
                        >
                            Demand
                        </button>
                        <button
                            className={`modal-btn ${
                                activeButton === 'Dropping' ? 'active' : ''
                            }`}
                            onClick={() => {
                                setActiveButton('Dropping');
                                convertExcelToJson(droppingData, 'Dropping');
                            }}
                        >
                            Dropping
                        </button>
                    </div>
                    <div>
                        <ModalDataTable
                            sliderValue={props.sliderValue}
                            locationName={locationName}
                            jsonDataFromExcel={jsonDataFromExcel}
                            fileName={fileName}
                        ></ModalDataTable>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        // variant="secondary"
                        className="closeButton btn btn-secondary"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MyModal;
