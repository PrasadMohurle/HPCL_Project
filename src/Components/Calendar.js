import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <div className="calendar">
            <DatePicker
                id= "datepicker"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
            />
            <h4>Day you selected: {selectedDate.getDate()}</h4>
        </div>
    );
};

export default Calendar;
