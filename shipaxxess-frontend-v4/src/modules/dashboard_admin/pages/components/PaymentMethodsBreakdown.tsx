import React from 'react';
//import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
interface PaymentMethod {
    gateway: string;
    value: number;

}
interface Props {
    paymentMethodsData: PaymentMethod[];

}
const PaymentMethodsBreakdown: React.FC<Props> = ({ paymentMethodsData }) => {
    return (
        <div className="bg-white md:col-span-2  p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Payment Methods Breakdown</h2>
            {/* <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {paymentMethodsData?.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer> */}
               <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    layout="vertical"
                    data={paymentMethodsData}
                    margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
                </ResponsiveContainer>
        </div>
    );
};

export default PaymentMethodsBreakdown;
