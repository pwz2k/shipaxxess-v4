import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays, startOfMonth, endOfMonth, subDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

interface CustomDateRangePickerProps {
    onDateChange: (start: Date | null, end: Date | null) => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({ onDateChange }) => {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const predefinedRanges = [
        {
            label: 'Today',
            range: () => ({
                startDate: new Date(),
                endDate: new Date(),
            }),
        },
        {
            label: 'Yesterday',
            range: () => ({
                startDate: subDays(new Date(), 1),
                endDate: subDays(new Date(), 1),
            }),
        },
        {
            label: 'Last 7 Days',
            range: () => ({
                startDate: subDays(new Date(), 6),
                endDate: new Date(),
            }),
        },
        {
            label: 'Last 30 Days',
            range: () => ({
                startDate: subDays(new Date(), 29),
                endDate: new Date(),
            }),
        },
        {
            label: 'This Month',
            range: () => ({
                startDate: startOfMonth(new Date()),
                endDate: endOfMonth(new Date()),
            }),
        },
    ];

    const handleSelect = (ranges: any) => {
        const { startDate, endDate } = ranges.selection;
        setState([ranges.selection]);
        onDateChange(startDate, endDate);
    };

    return (
        <div>
            <DateRangePicker
                ranges={state}
                onChange={handleSelect}
                staticRanges={predefinedRanges.map(({ label, range }) => ({
                    label,
                    range,
                    isSelected: () => false,
                }))}
                inputRanges={[]}
            />
        </div>
    );
};

export default CustomDateRangePicker;
