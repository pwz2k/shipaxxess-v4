import React from 'react';

interface FiltersProps {
    onDateChange: (start: Date | null, end: Date | null) => void;
}

const Filters: React.FC<FiltersProps> = ({ onDateChange }) => {
    return (
        <div className="flex items-center gap-x-2">
            {/* Implement date range picker and pass selected dates to onDateChange */}
            <span>Date Range Picker Placeholder</span>
        </div>
    );
};

export default Filters;
