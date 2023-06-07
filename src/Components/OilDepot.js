import React, { useState, useEffect } from 'react';
import '../App.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import csvToJson from 'csvtojson';
// import productData from './ProductData.csv';
import DepotLocation from './DepotLocation';
import stocksData from '../DataFiles/Stocks.xlsx';
import tankageData from '../DataFiles/Tankage.xlsx';

import { read, utils } from 'xlsx';

const OilDepot = (props) => {
    const {sliderValue} = props;

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
        // console.log(json);

        var dataOnDate = [];
        const updatedData = json.map((item) => {
            const excelDate = item.DATE_OF_DEMAND;
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const excelStartDate = new Date(1904, 0, 1); // Excel's start date
            const dateValue = new Date(
                excelStartDate.getTime() + (excelDate - 1) * millisecondsPerDay
            );

            const formattedDate = parseInt(`${dateValue.getDate()}`);
            // console.log(formattedDate);
            if (formattedDate === props.sliderValue) {
                return item;
            }
            return null;
        });
        // console.log(updatedData);
        dataOnDate.push(updatedData[sliderValue]);
        // console.log(dataOnDate);

        // const filteredData = {};
        // for (let key in dataOnDate) {
        //     if (key.startsWith(dataOnDate)) {
        //         console.log(dataOnDate[key]);
        //         filteredData[key] = dataOnDate[key];
        //         console.log(filteredData);
        //     }
        // }

        const locationName = [];
        for (let key in dataOnDate[0]) {
            // console.log(dataOnDate);
            var productNames = key.split('_');

            if (productNames.length < 3) {
                locationName.push(productNames[0]);
            }
        }
        // console.log(locationName);

        const uniqueLocations = Array.from(
            new Set(locationName.map((item) => item))
        );
        // console.log(uniqueLocations);


        const products = [];
            for (let key in dataOnDate[0]) {
                var productNames = key.split('_');

                if (productNames.length < 3) {
                    products.push(productNames[1]);
                }
            }
        // console.log(products);    
        const uniqueProducts = Array.from(new Set(products.map((item) => item)));
        // console.log(uniqueProducts);

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
        // console.log(TankageData);

        setJsonDataTankage(TankageData);
    }

    
      

    

    useEffect(() => {
        // async function loadCsvData() {
        //     const response = await fetch(productData);
        //     const csvData = await response.text();
        //     const json = await csvToJson().fromString(csvData);
        //     const uniqueLocations = Array.from(new Set(json.map((item) => item.location)));
        //     const uniqueProducts = Array.from(new Set(json.map((item) => item.group)));

        //     setOilDepotLocation(uniqueLocations);
        //     setOilDepotProducts(uniqueProducts);
        //     setJsonData(json);
        // }
        ExcelToJson_Stock();
        ExcelToJson_Tankage();
    }, [sliderValue]);

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
