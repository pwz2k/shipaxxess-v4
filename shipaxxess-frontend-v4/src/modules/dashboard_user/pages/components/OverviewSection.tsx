import React from 'react';

interface OverviewSectionProps {
    title: string;
    value: number;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ title, value }) => {
    return (
        <div className="bg-gray-200 p-4 rounded transition duration-300 hover:shadow-lg">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-600 text-xl font-bold">${value}</p>
        </div>
    );
};

export default OverviewSection;
