import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const peakOrderTimesData = [
    { hour: '00:00', orders: 30 },
    { hour: '01:00', orders: 20 },
    // Add more data points...
];

const PeakOrderTimes: React.FC = () => {
    return (
        <div className="bg-white p-4 md:col-span-2  rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Peak Order Times</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakOrderTimesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    {/* <YAxis /> */}
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PeakOrderTimes;
