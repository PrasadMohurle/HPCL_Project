import React, { useState } from 'react';
import '../App.css';
import MyModal from './MyModal';

const DepotLocation = (props) => {
    const [show, setShow] = useState(false);

    const {name, oilDepotProducts, jsonDataStocks, jsonDataTankage} = props;

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);




    return (
        <>
            <div className="logo">
                <img src="./images/oilContainer.png" alt="oilContainer" onClick={handleShow}/>
                <h5>{name}</h5>
            </div>
            <MyModal
                show={show}
                handleClose={handleClose}
                locationName={name}
                key={name}
                products={oilDepotProducts}
                jsonDataStocks={jsonDataStocks} 
                jsonDataTankage={jsonDataTankage}
                sliderValue = {props.sliderValue}
            ></MyModal>
        </>
    );
};

export default DepotLocation;
