import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin } from "lucide-react";
interface TopStateData {
    state: string;
    orders: number;
}

// List of all US states with abbreviations
const usStates = [
    { fullName: "Alabama", abbreviation: "AL" },
    { fullName: "Alaska", abbreviation: "AK" },
    { fullName: "Arizona", abbreviation: "AZ" },
    { fullName: "Arkansas", abbreviation: "AR" },
    { fullName: "California", abbreviation: "CA" },
    { fullName: "Colorado", abbreviation: "CO" },
    { fullName: "Connecticut", abbreviation: "CT" },
    { fullName: "Delaware", abbreviation: "DE" },
    { fullName: "Florida", abbreviation: "FL" },
    { fullName: "Georgia", abbreviation: "GA" },
    { fullName: "Hawaii", abbreviation: "HI" },
    { fullName: "Idaho", abbreviation: "ID" },
    { fullName: "Illinois", abbreviation: "IL" },
    { fullName: "Indiana", abbreviation: "IN" },
    { fullName: "Iowa", abbreviation: "IA" },
    { fullName: "Kansas", abbreviation: "KS" },
    { fullName: "Kentucky", abbreviation: "KY" },
    { fullName: "Louisiana", abbreviation: "LA" },
    { fullName: "Maine", abbreviation: "ME" },
    { fullName: "Maryland", abbreviation: "MD" },
    { fullName: "Massachusetts", abbreviation: "MA" },
    { fullName: "Michigan", abbreviation: "MI" },
    { fullName: "Minnesota", abbreviation: "MN" },
    { fullName: "Mississippi", abbreviation: "MS" },
    { fullName: "Missouri", abbreviation: "MO" },
    { fullName: "Montana", abbreviation: "MT" },
    { fullName: "Nebraska", abbreviation: "NE" },
    // { fullName: "Nevada", abbreviation: "NV" },
    // { fullName: "New Hampshire", abbreviation: "NH" },
    // { fullName: "New Jersey", abbreviation: "NJ" },
    // { fullName: "New Mexico", abbreviation: "NM" },
    // { fullName: "New York", abbreviation: "NY" },
    // { fullName: "North Carolina", abbreviation: "NC" },
    // { fullName: "North Dakota", abbreviation: "ND" },
    // { fullName: "Ohio", abbreviation: "OH" },
    // { fullName: "Oklahoma", abbreviation: "OK" },
    // { fullName: "Oregon", abbreviation: "OR" },
    // { fullName: "Pennsylvania", abbreviation: "PA" },
    // { fullName: "Rhode Island", abbreviation: "RI" },
    // { fullName: "South Carolina", abbreviation: "SC" },
    // { fullName: "South Dakota", abbreviation: "SD" },
    // { fullName: "Tennessee", abbreviation: "TN" },
    // { fullName: "Texas", abbreviation: "TX" },
    // { fullName: "Utah", abbreviation: "UT" },
    // { fullName: "Vermont", abbreviation: "VT" },
    // { fullName: "Virginia", abbreviation: "VA" },
    // { fullName: "Washington", abbreviation: "WA" },
    // { fullName: "West Virginia", abbreviation: "WV" },
    // { fullName: "Wisconsin", abbreviation: "WI" },
    // { fullName: "Wyoming", abbreviation: "WY" }
];

const generateRandomData = (): TopStateData[] => {
    return usStates.map(({ fullName }) => ({
        state: fullName,
        orders: Math.floor(Math.random() * 1000)
    }));
};

const TopStatesBarChart: React.FC = () => {
    const [topStatesData, setTopStatesData] = useState<TopStateData[]>([]);

    useEffect(() => {
        const data = generateRandomData();
        setTopStatesData(data);
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className='flex justify-normal gap-x-1'>
                <MapPin size={24} />

                <h2 className="text-lg font-bold mb-2"> Top States</h2>

            </div>

            <h2 className="text-sm font-bold mb-4 text-gray-400 border-b-2 border-gray-300 pb-2">Overview</h2>


            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topStatesData}>
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="state" />
                    {/* <YAxis /> */}
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
};

export default TopStatesBarChart;
