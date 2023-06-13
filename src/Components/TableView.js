import React from 'react';
import { Table } from 'react-bootstrap';

const TableView = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const tableData = data.map(({ color, day, ...rest }, index) => ({
        'Sr.': index + 1,
        ...rest,
    }));

    return (
        <div className="tableView-container">
            <Table striped bordered hover className="table">
                <thead className='table-head'>
                    <tr>
                        {Object.keys(tableData[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, index) => (
                        <tr key={index}>
                            {Object.values(item).map((value, i) => (
                                <td key={i}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );

   
};

export default TableView;
