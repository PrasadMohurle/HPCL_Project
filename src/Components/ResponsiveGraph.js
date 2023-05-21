import React, { useEffect, useState } from 'react';
import './graph.css';

const ResponsiveGraph = (props) => {
    const { data } = props;

    console.log('data', data);

    var [productVolume_YAxis, setProductVolume_YAxis] = useState('');
    var [ullage, setUllage] = useState('');
    var [stringVolume, setStringVolume] = useState('');

    var capacity = parseInt(data.Capacity);
    var volume = parseInt(data.Volume);

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

    const getFillColor = (group) => {
        switch (group) {
            case 'Diesel':
                return '#BB6BD9';
            case 'Petrol':
                return '#E44E3A';
            case 'Kerosene':
                return '#45D645';
            case 'H6':
                return '#008AFa';
            default:
                return '#676767'; // Default color if group doesn't match any case
        }
    };

    const fillColor = getFillColor(data.group);

    useEffect(() => {
        const calculation = () => {
            var scaleCapacity = scale(capacity);
            var scaleVolume = scale(volume);
            setUllage('' + (scaleCapacity - scaleVolume));
            setProductVolume_YAxis('' + (scaleCapacity - scaleVolume + 40));
            setStringVolume('' + scaleVolume);
        };

        calculation();
    }, [data]);

    return (
        <div className="SVG-container">

            <svg width="90" height="380" className="svg">
                <g>
                    <rect
                        x="20"
                        y="40"
                        width="50"
                        height={ullage}
                        className="ullage"
                    />
                    <text
                        x="32"
                        y="60"
                        font-size="15"
                        fontWeight="500"
                        fill="black"
                    >
                        {100 - Math.round((volume / capacity) * 100)}%
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
                        x="32"
                        y="330"
                        font-size="15"
                        fontWeight="500"
                        fill="black"
                    >
                        {Math.round((volume / capacity) * 100)}%
                    </text>
                </g>
            </svg>
            <h5>{data.group}</h5>
        </div>
    );
};

export default ResponsiveGraph;
