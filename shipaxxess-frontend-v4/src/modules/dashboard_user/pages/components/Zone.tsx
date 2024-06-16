import React from 'react';
import { BarChart, CartesianGrid, XAxis, Tooltip, Legend, Bar, ResponsiveContainer, Text } from 'recharts';

interface ChartData {
    zone: string;
    value: number;

}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DateBarChart: React.FC = () => {
    // Generate random values for zones 1 to 9
    const data: ChartData[] = Array.from({ length: 9 }, (_, index) => ({
        zone: `Zone ${index + 1}`,
        value: Math.floor(Math.random() * 5000) + 1000, // Random value between 1000 and 6000
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <Text x={0} y={0} dx={200} dy={20} textAnchor="middle" scaleToFit={true} width={500} style={{ fontSize: '24px' }}>
                    Receipt Zones
                </Text>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zone" />

                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                    {data.map((entry, index) => (
                        <Bar key={`bar-${index}`} dataKey="value" fill='red' />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DateBarChart;
