import { Boxes } from 'lucide-react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
    label: string;
    value: number;
}

interface GenericLineChartProps {
    data: ChartData[];
    title: string;
    valueKey: string;
    icon: React.ReactNode;
    width?: number;
    height?: number;

}

const GenericLineChart: React.FC<GenericLineChartProps> = ({ data, title, valueKey, icon, width = "100%", height = 400 }) => {
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className='flex justify-center gap-x-1'>
                {icon}
                <h2 className="text-lg font-bold mb-2">{title}</h2>
            </div>
            <div className="flex justify-center mb-4">
                <h3 className="text-xl font-bold">${totalValue.toFixed(2)}</h3>
            </div>
            {/* <h2 className="text-sm font-bold mb-4 text-gray-400 border-b-2 border-gray-300 pb-2">Overview</h2> */}

            <ResponsiveContainer width={width} height={height}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey={valueKey}
                        stroke="#8884d8"
                        strokeDasharray="8 8"
                        strokeWidth={3}
                        dot={{ r: 6 }} // Larger dots
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GenericLineChart;
