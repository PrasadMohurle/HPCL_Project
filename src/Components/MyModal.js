import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ResponsiveGraph from './ResponsiveGraph';
import '../App.css';

function MyModal(props) {
    const [filteredDataOnLocation, setFilteredDataOnLocation] = useState([]);

    const { show, handleClose, locationName, jsonData } = props;

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
                    {filteredDataOnLocation.map((data) => (
                        <ResponsiveGraph data={data} key={data.group} />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        className="closeButton"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MyModal;
