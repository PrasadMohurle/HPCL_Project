import React, { useState, useEffect } from 'react';
import '../App.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import csvToJson from 'csvtojson';
import productData from './ProductData.csv';
import DepotLocation from './DepotLocation';

const OilDepot = () => {
    const [oilDepotLocation, setOilDepotLocation] = useState([]);
    const [oilDepotProducts, setOilDepotProducts] = useState([]);
    const [jsonData, setJsonData] = useState([]);


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

    useEffect(() => {
        async function loadCsvData() {
            const response = await fetch(productData);
            const csvData = await response.text();
            const json = await csvToJson().fromString(csvData);
            const uniqueLocations = Array.from(new Set(json.map((item) => item.location)));
            const uniqueProducts = Array.from(new Set(json.map((item) => item.group)));

            setOilDepotLocation(uniqueLocations);
            setOilDepotProducts(uniqueProducts);
            setJsonData(json);
        }
        loadCsvData();
    }, []);

    const depotLocation = oilDepotLocation.map((item) => (
        <DepotLocation key={item} name={item} oilDepotProducts={oilDepotProducts} jsonData={jsonData}/>
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
