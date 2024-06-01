import { DollarSign } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const AverageCostCard: React.FC = () => {
    const [averageCostData, setAverageCostData] = useState<{ id: string; label: string; cost: number }[]>([]);

    useEffect(() => {
        // Generate random data for average cost
        const randomAverageCostData = Array.from({ length: 20 }, (_, index) => ({
            id: generateRandomId(),
            label: `Label ${index + 1}`,
            cost: Math.random() * 100, // Generate random cost
        }));
        setAverageCostData(randomAverageCostData);
    }, []);

    // Function to generate a random ID
    const generateRandomId = () => {
        return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className='flex justify-normal gap-x-1'>
                <DollarSign size={24} className='  mt-1' />

                <h2 className="text-lg font-bold mb-2">Average Cost</h2>

            </div>

            <h2 className="text-sm font-bold mb-4 text-gray-400 border-b-2 border-gray-300 pb-2">Overview</h2>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr>
                            <th className="py-2">ID</th>
                            <th className="py-2">Label</th>
                            <th className="py-2">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {averageCostData.map(({ id, label, cost }, index) => (
                            <tr key={id} className="border-b border-gray-200">
                                <td className="py-2">{id}</td>
                                <td className="py-2">{label}</td>
                                <td className="py-2">{cost.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AverageCostCard;
