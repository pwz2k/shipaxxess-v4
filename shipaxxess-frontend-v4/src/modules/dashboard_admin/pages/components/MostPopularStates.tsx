import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const popularStatesData = [
    { state: 'California', orders: 400 },
    { state: 'Texas', orders: 300 },
    { state: 'New York', orders: 200 },
    { state: 'Florida', orders: 100 },
    { state: 'Illinois', orders: 50 },
    { state: 'Pennsylvania', orders: 40 },
    { state: 'Ohio', orders: 30 },
    { state: 'Georgia', orders: 20 },
    { state: 'North Carolina', orders: 10 },
    { state: 'Michigan', orders: 5 },
    { state: 'New Jersey', orders: 8 },

];

const MostPopularStates: React.FC = () => {
    return (
        <div className="bg-white p-4 md:col-span-2  rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Most Popular States</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularStatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MostPopularStates;
