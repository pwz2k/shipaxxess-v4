import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const refundsByCarrierData = [
    { name: 'UPS', value: 400 },
    { name: 'FedEx', value: 300 },
    { name: 'DHL', value: 300 },
    { name: 'USPS', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RefundsByCarrier: React.FC = () => {
    return (
        <div className="bg-white md:col-span-2  p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Refunds by Shipping Carrier</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={refundsByCarrierData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {refundsByCarrierData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RefundsByCarrier;
