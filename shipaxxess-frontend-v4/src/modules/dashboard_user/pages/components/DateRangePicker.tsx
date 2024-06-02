import { DatePicker } from '@client/components/common/picker';
import React, { useState } from 'react';

interface DateRangePickerProps {
    onDateChange: (start: Date | null, end: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        onDateChange(date, endDate);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        onDateChange(startDate, date);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg mb-4 flex">
            <div className="flex flex-col mr-1">
                {/* <label htmlFor="start-date" className="text-gray-600 mb-2">Start Date</label> */}
                <DatePicker
                    field={{
                        onChange: handleStartDateChange,
                        onBlur: () => { },
                        value: startDate,
                        disabled: false,
                        name: 'start-date',
                        ref: () => { }

                    }}

                />
            </div>
            <div className="flex flex-col">
                {/* <label htmlFor="end-date" className="text-gray-600 mb-2">End Date</label> */}
                <DatePicker
                    field={{
                        onChange: handleEndDateChange,
                        onBlur: () => { },
                        value: endDate,
                        disabled: false,
                        name: 'end-date',
                        ref: () => { }
                    }}
                />
            </div>
        </div>
    );
};

export default DateRangePicker;
