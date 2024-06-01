// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface DateRangePickerProps {
//     onDateChange: (start: Date | null, end: Date | null) => void;
// }

// const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
//     const [startDate, setStartDate] = useState<Date | null>(new Date());
//     const [endDate, setEndDate] = useState<Date | null>(new Date());

//     const handleDateChange = (dates: [Date | null, Date | null]) => {
//         const [start, end] = dates;
//         setStartDate(start);
//         setEndDate(end);
//         onDateChange(start, end);
//     };

//     return (
//         <div className="p-4 bg-white shadow-md rounded-lg mb-4">
//             <h2 className="text-lg font-bold mb-2">Select Date Range</h2>
//             <DatePicker
//                 selected={startDate}
//                 onChange={handleDateChange}
//                 startDate={startDate}
//                 endDate={endDate}
//                 selectsRange
//                 inline
//             />
//         </div>
//     );
// };

// export default DateRangePicker;
