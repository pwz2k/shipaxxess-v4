import React, { useState } from 'react';

const referralUsersData = [
    // Add more details to each user object
    { id: 1, name: 'User 1', fullName: 'Full Name 1', email: 'user1@example.com', timeZone: 'GMT', referrals: 30, joined: '2022-01-01', status: 'Active' },
    { id: 2, name: 'User 2', fullName: 'Full Name 2', email: 'user1@example.com', timeZone: 'GMT', referrals: 25, joined: '2022-01-01', status: 'Active' },
    { id: 3, name: 'User 3', fullName: 'Full Name 3', email: 'user1@example.com', timeZone: 'GMT', referrals: 20, joined: '2022-01-01', status: 'Active' },
    { id: 4, name: 'User 4', fullName: 'Full Name 4', email: 'user1@example.com', timeZone: 'GMT', referrals: 15, joined: '2022-01-01', status: 'Active' },
    { id: 5, name: 'User 5', fullName: 'Full Name 5', email: 'user2@gmail.com', timeZone: 'GMT', referrals: 10, joined: '2022-01-01', status: 'Active' },




];

const TopReferralUsers: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = referralUsersData.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="bg-white w-full md:col-span-2 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Top Referral Users</h2>
            <ul>
                {currentUsers.map(user => (
                    <li key={user.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="text-lg font-medium">{user.name}</span>
                        <span className="text-gray-500">{user.fullName}</span>
                        <span className="text-gray-500">{user.email}</span>
                        <span className="text-gray-500">{user.timeZone}</span>
                        <span className="text-gray-500">{user.referrals} referrals</span>
                        <span className="text-gray-500">{user.joined}</span>
                        <span className="text-gray-500">{user.status}</span>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center mt-4">
                {[...Array(Math.ceil(referralUsersData.length / usersPerPage)).keys()].map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number + 1)}
                        className={`h-8 w-8 ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-full focus:outline-none`}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TopReferralUsers;