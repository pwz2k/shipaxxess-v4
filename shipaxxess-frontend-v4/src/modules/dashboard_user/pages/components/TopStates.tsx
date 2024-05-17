import React from 'react';

interface State {
    id: number;
    name: string;
}

interface TopStatesProps {
    states: State[];
}

const TopStates: React.FC<TopStatesProps> = ({ states }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-2">Top States</h3>
            <h2 className="text-sm font-bold mb-4 text-gray-400 border-b-2 border-gray-300 pb-2">Overview</h2>
            <div className="bg-gray-100 p-4 rounded">
                {states.map(state => (
                    <p key={state.id} className="text-gray-600 text-xl font-bold">{state.name}</p>
                ))}
            </div>
        </div>
    );
};

export default TopStates;
