import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const profitsData = [
    { month: 'Jan', profit: 400 },
    { month: 'Feb', profit: 300 },
    { month: 'Mar', profit: 200 },
    { month: 'Apr', profit: 278 },
    { month: 'May', profit: 189 },
    { month: 'Jun', profit: 239 },
    { month: 'Jul', profit: 349 },
    { month: 'Aug', profit: 200 },
    { month: 'Sep', profit: 300 },
    { month: 'Oct', profit: 400 },
    { month: 'Nov', profit: 500 },
    { month: 'Dec', profit: 600 },
    // Add more data points...
];
interface Profit {
    month: string;
    profit: number;
}
interface Props {
    profitsData: Profit[];
}
const Profits: React.FC<Props> = ({ profitsData }) => {
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
