import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface PeakOrderTime {
    hour: string;
    orders: number;
}
interface Props {
    peakOrderTimesData: PeakOrderTime[];

}
const PeakOrderTimes: React.FC<Props> = ({ peakOrderTimesData }) => {
    console.log(peakOrderTimesData, "peakOrderTimesData");
    return (
        <div className="bg-white p-4 md:col-span-2  rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Peak Order Times</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakOrderTimesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />

                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PeakOrderTimes;
