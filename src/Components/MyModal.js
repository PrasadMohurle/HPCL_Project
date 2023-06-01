import React, { useState, useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ResponsiveGraph from './ResponsiveGraph';
import ModalDataTable from './ModalDataTable';

import '../App.css';

function MyModal(props) {
    const [filteredDataOnLocation, setFilteredDataOnLocation] = useState([]);

    const { show, handleClose, locationName, jsonData } = props;
    // console.log(props.sliderValue);

    useEffect(() => {
        setFilteredDataOnLocation(
            jsonData.filter((data) => data.location === locationName)
        );
    }, []);

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
                    <div className='modal-btns-list'>
                        <button className='modal-btn'>Show Garph</button>
                        <button className='modal-btn'>Stock</button>
                        <button className='modal-btn'>Tankage</button>
                        <button className='modal-btn'>Demand</button>
                        <button className='modal-btn'>Dropping</button>
                    </div>
                    <div className='modal-graph'>
                        {filteredDataOnLocation.map((data) => (
                            <ResponsiveGraph data={data} key={data.group} />
                        ))}
                    </div>
                    <div>
                        <ModalDataTable sliderValue= {props.sliderValue} locationName= {locationName}></ModalDataTable>
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
