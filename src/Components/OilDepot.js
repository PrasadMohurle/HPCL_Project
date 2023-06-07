import React, { useState, useEffect } from 'react';
import '../App.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import DepotLocation from './DepotLocation';
import stocksData from '../DataFiles/Stocks.xlsx';
import tankageData from '../DataFiles/Tankage.xlsx';
import { read, utils } from 'xlsx';

const OilDepot = (props) => {
    const { sliderValue } = props;

    const [oilDepotLocation, setOilDepotLocation] = useState([]);
    const [oilDepotProducts, setOilDepotProducts] = useState([]);
    const [jsonDataStocks, setJsonDataStocks] = useState([]);
    const [jsonDataTankage, setJsonDataTankage] = useState([]);

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 1440 },
            items: 4,
            slidesToSlide: 4,
        },
        desktop: {
            breakpoint: { max: 1440, min: 1023 },
            items: 4,
            slidesToSlide: 3,
        },
        tablet: {
            breakpoint: { max: 1023, min: 425 },
            items: 3,
            slidesToSlide: 3,
        },
        mobile: {
            breakpoint: { max: 425, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    async function ExcelToJson_Stock() {
        const response = await fetch(stocksData);
        const data = await response.arrayBuffer();
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonOptions = { defval: 0, blankrows: true };
        const json = utils.sheet_to_json(worksheet, jsonOptions);

        var dataOnDate = [];
        const updatedData = json.map((item) => {
            const excelDate = item.DATE_OF_DEMAND;
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const excelStartDate = new Date(1904, 0, 1); // Excel's start date
            const dateValue = new Date(
                excelStartDate.getTime() + (excelDate - 1) * millisecondsPerDay
            );

            const formattedDate = parseInt(`${dateValue.getDate()}`);
            if (formattedDate === props.sliderValue) {
                return item;
            }
            return null;
        });
        dataOnDate.push(updatedData[sliderValue]);

        const locationName = [];
        for (let key in dataOnDate[0]) {
            var loc = key.split('_');

            if (loc.length < 3) {
                locationName.push(loc[0]);
            }
        }
        const uniqueLocations = Array.from(
            new Set(locationName.map((item) => item))
        );

        const products = [];
        for (let key in dataOnDate[0]) {
            var productNames = key.split('_');

            if (productNames.length < 3) {
                products.push(productNames[1]);
            }
        }
        const uniqueProducts = Array.from(
            new Set(products.map((item) => item))
        );

        setOilDepotLocation(uniqueLocations);
        setOilDepotProducts(uniqueProducts);
        setJsonDataStocks(dataOnDate);
    }

    async function ExcelToJson_Tankage() {
        const response = await fetch(tankageData);
        const data = await response.arrayBuffer();
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonOptions = { defval: 0, blankrows: true };
        const json = utils.sheet_to_json(worksheet, jsonOptions);

        var TankageData = json[0];
        setJsonDataTankage(TankageData);
    }

    useEffect(() => {
        ExcelToJson_Stock();
        ExcelToJson_Tankage();
    },// eslint-disable-next-line
    [sliderValue]);

    const depotLocation = oilDepotLocation.map((item) => (
        <DepotLocation
            key={item}
            name={item}
            oilDepotProducts={oilDepotProducts}
            jsonDataStocks={jsonDataStocks}
            jsonDataTankage={jsonDataTankage}
            sliderValue={props.sliderValue}
        />
    ));

    return (
        <>
            <div className="depotWrapper">
                <Carousel responsive={responsive} customTransition="all 1.5s">
                    {depotLocation}
                </Carousel>
            </div>
        </>
    );
};

export default OilDepot;
