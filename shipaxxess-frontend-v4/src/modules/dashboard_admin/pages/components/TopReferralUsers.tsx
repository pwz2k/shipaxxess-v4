import React from 'react';

const referralUsersData = [
    { id: 1, name: 'User 1', referrals: 30 },
    { id: 2, name: 'User 2', referrals: 20 },
    { id: 3, name: 'User 3', referrals: 10 },
];

const TopReferralUsers: React.FC = () => {
    return (
        <div className="bg-white p-4 md:col-span-2  rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Top Referral Users</h2>
            <ul>
                {referralUsersData.map(user => (
                    <li key={user.id} className="mb-2">
                        {user.name}: {user.referrals} referrals
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopReferralUsers;
