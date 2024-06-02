import React, { useState, useEffect } from 'react';
import { TicketIcon } from "lucide-react";

const PendingRefundsCard: React.FC = () => {
    const [pendingRefunds, setPendingRefunds] = useState<{ id: string; amount: number; date: string }[]>([]);

    useEffect(() => {
        // Generate random data for pending refunds
        const randomPendingRefunds = Array.from({ length: 40 }, () => ({
            id: generateRandomId(),
            amount: Math.floor(Math.random() * 100), // Generate random amount
            date: generateRandomDate(), // Generate random date
        }));
        setPendingRefunds(randomPendingRefunds);
    }, []);

    // Function to generate a random refund ID
    const generateRandomId = () => {
        return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
    };

    // Function to generate a random date (in this example, within the past year)
    const generateRandomDate = () => {
        const start = new Date();
        const end = new Date(start.getFullYear() - 1, start.getMonth(), start.getDate());
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toLocaleDateString('en-US');
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className='flex justify-normal gap-x-1'>
                <TicketIcon size={24} className='mr-2 mt-1' />
                <h2 className="text-lg font-bold mb-2">Pending Refunds</h2>
            </div>
            <h2 className="text-sm font-bold mb-4 text-gray-400 border-b-2 border-gray-300 pb-2">Overview</h2>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                <table className="w-full">
                    <thead className="sticky top-0 top-0 bg-gray-100 z-10"> {/* Apply sticky positioning to the table header */}
                        <tr>
                            <th className="py-2 text-left">Refund ID</th>
                            <th className="py-2 text-left">Amount</th>
                            <th className="py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingRefunds.map((refund, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-2">{refund.id}</td>
                                <td className="py-2">${refund.amount}</td>
                                <td className="py-2">{refund.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingRefundsCard;
