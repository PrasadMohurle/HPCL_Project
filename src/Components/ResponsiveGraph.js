import React, { useEffect, useState } from 'react';
import './graph.css';

const ResponsiveGraph = (props) => {
    const { volumeData, capacityData, productName } = props;

    var [productVolume_YAxis, setProductVolume_YAxis] = useState('');
    var [ullage, setUllage] = useState('');
    var [stringVolume, setStringVolume] = useState('');

    const capacity = capacityData;
    var volume = volumeData;

    let domain = [0, capacity]; // input data values
    let range = [0, 300]; // output values

    function scale(value) {
        let domainMin = domain[0];
        let domainMax = domain[1];
        let rangeMin = range[0];
        let rangeMax = range[1];

        let scaledValue =
            ((value - domainMin) / (domainMax - domainMin)) *
                (rangeMax - rangeMin) +
            rangeMin;
        return scaledValue;
    }

    const getFillColor = (productName) => {
        switch (productName) {
            case 'H6':
                return '#BB6BD9';
            case 'H4':
                return '#ffa835';
            case 'M6':
                return '#E44E3A';
            case 'K':
                return '#45D645';
            case 'LAN':
                return '#008AFa';
            default:
                return '#676767'; // Default color if group doesn't match any case
        }
    };

    const fillColor = getFillColor(productName);

    useEffect(() => {
        const calculation = () => {
            var scaleCapacity = scale(capacity);
            var scaleVolume = scale(volume);
            setUllage('' + (scaleCapacity - scaleVolume));
            setProductVolume_YAxis('' + (scaleCapacity - scaleVolume));
            setStringVolume('' + scaleVolume);
        };
        // console.log("data", data);
        calculation();
    },// eslint-disable-next-line
     [volumeData, capacityData]);

    return (
        <div className="SVG-container">
            <svg width="90" height="300" className="svg">
                <g>
                    <rect
                        x="20"
                        y="0"
                        width="50"
                        height={ullage}
                        className="ullage"
                    />
                    <text
                        x="45"
                        y="20"
                        fontSize="16"
                        fontWeight="500"
                        fill="black"
                        textAnchor="middle" 
                    >
                        {capacity}
                    </text>
                </g>
                <g>
                    <rect
                        x="20"
                        y={productVolume_YAxis}
                        width="50"
                        height={stringVolume}
                        className="product_volumn"
                        style={{ fill: fillColor }}
                    />
                    <text
                        x="45"
                        y="290"
                        fontSize="16"
                        fontWeight="500"
                        fill="black"
                        textAnchor="middle" 
                    >
                        {volume}
                    </text>
                </g>
            </svg>
            <h5>{productName}</h5>
        </div>
    );
};

export default ResponsiveGraph;
