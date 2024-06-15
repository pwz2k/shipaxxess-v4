import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Text } from 'recharts';

interface ChartData {
    date: string;
    value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DateBarChart: React.FC = () => {
    const data: ChartData[] = [
        { date: '2022-01-01', value: 400 },
        { date: '2022-01-02', value: 300 },
        { date: '2022-01-03', value: 300 },
        { date: '2022-01-04', value: 200 },
        // Add more data as needed
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <Text x={0} y={0} dx={200} dy={20} textAnchor="middle" scaleToFit={true} width={500} style={{ fontSize: '24px' }}>
                    Chart Title
                </Text>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="value" fill={COLORS[index % COLORS.length]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DateBarChart;