import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const refundedOrdersData = [
    { month: 'Jan', refunds: 40 },
    { month: 'Feb', refunds: 30 },
    { month: 'Mar', refunds: 20 },
    { month: 'Apr', refunds: 28 },
    { month: 'May', refunds: 18 },
    { month: 'Jun', refunds: 23 },
    { month: 'Jul', refunds: 34 },
    { month: 'Aug', refunds: 20 },
    { month: 'Sep', refunds: 30 },
    { month: 'Oct', refunds: 40 },
    { month: 'Nov', refunds: 50 },
    { month: 'Dec', refunds: 60 },

];

const RefundedOrders: React.FC = () => {
    return (
        <div className="bg-white md:col-span-2  p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Refunded Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={refundedOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    {/* <YAxis /> */}
                    <Tooltip />
                    <Bar dataKey="refunds" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RefundedOrders;
