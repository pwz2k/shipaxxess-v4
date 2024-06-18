import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const peakOrderTimesData = [
    { hour: '00:00', orders: 30 },
    { hour: '01:00', orders: 20 },
    { hour: '02:00', orders: 10 },
    { hour: '03:00', orders: 5 },
    { hour: '04:00', orders: 8 },
    { hour: '05:00', orders: 15 },
    { hour: '06:00', orders: 20 },
    { hour: '07:00', orders: 30 },
    { hour: '08:00', orders: 40 },
    { hour: '09:00', orders: 50 },
    { hour: '10:00', orders: 60 },
    { hour: '11:00', orders: 70 },
    { hour: '12:00', orders: 80 },
    { hour: '13:00', orders: 90 },
    { hour: '14:00', orders: 100 },
    { hour: '15:00', orders: 110 },
    { hour: '16:00', orders: 120 },
    { hour: '17:00', orders: 130 },
    { hour: '18:00', orders: 140 },
    { hour: '19:00', orders: 150 },
    { hour: '20:00', orders: 160 },
    { hour: '21:00', orders: 170 },
    { hour: '22:00', orders: 180 },
    { hour: '23:00', orders: 190 },

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
