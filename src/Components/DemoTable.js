import React from 'react';
import { Table } from 'react-bootstrap';
import './DemoTable.css';

const getBackgroundColor = (productName) => {
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
            return ''; // Default color if group doesn't match any case
    }
};

const DemoTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available.</p>;
    }

    const tableData = data.map(({ color, day, name, value, ...rest }, index) => ({
        'Sr. Num': index + 1,
        Quantity: value,
        Product: name,
        
        ...rest,
    }));

    return (
        <div className="demo-table-container">
            <Table className="demo-table">
                <tr>
                    <th className="demo-table-head">
                        {Object.keys(tableData[0]).map((key) => (
                            <tr key={key}>
                                <td>{key}</td>
                            </tr>
                        ))}
                    </th>

                    {tableData.map((item, index) => (
                        <td key={index}>
                            {Object.values(item).map((value, i) => (
                                <tr key={i} style={{ backgroundColor: getBackgroundColor(value) }}>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </td>
                    ))}
                </tr>
            </Table>
        </div>
    );
};

export default DemoTable;
