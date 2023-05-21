import React, { useEffect, useState } from 'react';
import './graph.css';
import csvToJson from 'csvtojson';
import productData from './ProductData.csv';

const SingleProductGraph = () => {
    var [productVolume_YAxis, setProductVolume_YAxis] = useState('');
    var [ullage, setUllage] = useState('');
    var [stringVolume, setStringVolume] = useState('');

    let updatedArray = [];
    useEffect(() => {
        async function loadCsvData() {
            // console.log(data);
            const response = await fetch(productData);
            const csvData = await response.text();
            // console.log(csvData);
            const json = await csvToJson().fromString(csvData);
            // console.log(json);
            updatedArray = json.map((item) => ({
                ...item,
                Volume: parseInt(item.Volume),
                Capacity: parseInt(item.Capacity),
            }));
            updatedArray.map((item) => {
                if (item.group === 'Petrol' && item.location === 'palampur') {
                    calculation(item.Capacity, item.Volume);
                }
            });
        }
        loadCsvData();

        const calculation = (capacity, volume) => {
            setUllage('' + (capacity - volume));
            setProductVolume_YAxis('' + (capacity - volume + 40));
            setStringVolume('' + volume);          
        };
    }, []);

    return (
        <div>
            <svg width="400" height="320" className="svg">
                <rect
                    x="5
                    0"
                    y="40"
                    width="50"
                    height={ullage}
                    className="ullage"
                />
                <rect
                    x="50"
                    y={productVolume_YAxis}
                    width="50"
                    height={stringVolume}
                    className="product_volumn"
                />
            </svg>
        </div>
    );
};

export default SingleProductGraph;
