import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const paymentMethodsData = [
    { name: 'Credit Card', value: 400 },
    { name: 'PayPal', value: 300 },
    { name: 'Bank Transfer', value: 200 },
    { name: 'Cash', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
interface PaymentMethod {
    name: string;
    value: number;

}
interface Props {
    paymentMethodsData: PaymentMethod[];

}
const PaymentMethodsBreakdown: React.FC<Props> = ({ paymentMethodsData }) => {
    return (
        <div className="bg-white md:col-span-2  p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Payment Methods Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {paymentMethodsData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PaymentMethodsBreakdown;
