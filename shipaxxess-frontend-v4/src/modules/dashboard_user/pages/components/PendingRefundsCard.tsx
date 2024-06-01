import React, { useState, useEffect } from 'react';

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
            <h2 className="text-lg font-bold mb-2">Pending Refunds</h2>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10"> {/* Apply sticky positioning to the table header */}
                        <tr>
                            <th className="py-2">Refund ID</th>
                            <th className="py-2">Amount</th>
                            <th className="py-2">Date</th>
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
