import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const profitsData = [
    { month: 'Jan', profit: 400 },
    { month: 'Feb', profit: 300 },
    { month: 'Mar', profit: 200 },
    { month: 'Apr', profit: 278 },
    // Add more data points...
];

const Profits: React.FC = () => {
    return (
        <div className="bg-white md:col-span-2  p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Profits</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    {/* <YAxis /> */}
                    <Tooltip />
                    <Line type="monotone" dataKey="profit" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Profits;
