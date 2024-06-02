


import React, { ReactElement } from 'react';

interface OverviewSectionProps {
    title: string;
    value: number;
    icon?: ReactElement; // Change the type of 'icon' to 'ReactElement'
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ title, value, icon }) => { // Remove the alias 'Icon'
    return (
        <div className="bg-gray-200 p-4 rounded transition duration-300 hover:shadow-lg">

            <div className='flex justify-between'>
                <h2 className="text-lg font-bold mb-2">{title}</h2>
                {icon}
            </div>
            <p className="text-gray-600 text-xl font-bold">${value}</p>
        </div>
    );
};

export default OverviewSection;