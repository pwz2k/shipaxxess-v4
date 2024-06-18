import React, { useState, useEffect } from 'react';
import Title from '@client/components/common/title';
import { LayoutDashboardIcon } from 'lucide-react';
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	BarChart,
	Bar,
	Legend,
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
} from 'recharts';

// Importing the new components
import TopShippingCategories from './components/TopShippingCategories';
import PeakOrderTimes from './components/PeakOrderTimes';
import MostPopularStates from './components/MostPopularStates';
import TopReferralUsers from './components/TopReferralUsers';
import PaymentMethodsBreakdown from './components/PaymentMethodsBreakdown';
import Profits from './components/Profits';
import RefundedOrders from './components/RefundedOrders';
import RefundsByCarrier from './components/RefundsByCarrier';

interface User {
	id: number;
	name: string;
	email: string;
}
interface Report {
	id: number;
	title: string;
	status: string;
}

const AdminDashboard: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [reports, setReports] = useState<Report[]>([]);
	const [newUsers, setNewUsers] = useState<number>(0);
	const [activeRefunds, setActiveRefunds] = useState<number>(0);
	const [openTickets, setOpenTickets] = useState<number>(0);
	const [totalEarnings, setTotalEarnings] = useState<number>(0);
	const [startDate, setStartDate] = useState<Date | null>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(new Date());

	// Simulate fetching users
	useEffect(() => {
		const fetchedUsers = [
			{ id: 1, name: 'User 1', email: 'user1@example.com' },
			{ id: 2, name: 'User 2', email: 'user2@example.com' },
			{ id: 3, name: 'User 3', email: 'user3@example.com' },
			{ id: 4, name: 'User 4', email: 'user4@example.com' },
			// Add more users here...
		];
		setUsers(fetchedUsers);
		setNewUsers(4); // Simulate new user count
	}, []);

	// Simulate fetching reports
	useEffect(() => {
		const fetchedReports = [
			{ id: 1, title: 'Report 1', status: 'Open' },
			{ id: 2, title: 'Report 2', status: 'Closed' },
			{ id: 3, title: 'Report 3', status: 'Open' },
			{ id: 4, title: 'Report 4', status: 'Closed' },
			// Add more reports here...
		];
		setReports(fetchedReports);
		setActiveRefunds(2); // Simulate active refund requests
		setOpenTickets(2); // Simulate opened tickets
		setTotalEarnings(1000); // Simulate total earnings
	}, []);

	const userData = users.map((user) => ({
		name: user.name,
		id: user.id,
	}));

	const reportData = reports.map((report) => ({
		title: report.title,
		status: report.status,
	}));

	const earningsData = [
		{ name: 'Total Earnings', value: totalEarnings },
		{ name: 'Refunds', value: activeRefunds },
	];

	const revenueByCategoryData = [
		{ name: 'Category A', value: 400 },
		{ name: 'Category B', value: 300 },
		{ name: 'Category C', value: 300 },
		{ name: 'Category D', value: 200 },
	];

	const monthlyRevenueData = [
		{ month: 'Jan', revenue: 400 },
		{ month: 'Feb', revenue: 300 },
		{ month: 'Mar', revenue: 200 },
		{ month: 'Apr', revenue: 278 },
		{ month: 'May', revenue: 189 },
		{ month: 'Jun', revenue: 239 },
		{ month: 'Jul', revenue: 349 },
		{ month: 'Aug', revenue: 200 },
		{ month: 'Sep', revenue: 300 },
		{ month: 'Oct', revenue: 400 },
		{ month: 'Nov', revenue: 500 },
		{ month: 'Dec', revenue: 600 },
	];

	const topSellingProducts = [
		{ name: 'Product A', sales: 2400 },
		{ name: 'Product B', sales: 4567 },
		{ name: 'Product C', sales: 1398 },
		{ name: 'Product D', sales: 9800 },
		{ name: 'Product E', sales: 3908 },
		{ name: 'Product F', sales: 4800 },
	];

	const COLORS = ['#0088FE', '#00C49F'];
	const CATEGORY_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

	return (
		<div className="px-4 py-4 bg-gray-100 min-h-screen">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-x-2">
					<LayoutDashboardIcon size={24} />
					<Title title="Admin Dashboard" />
				</div>
				<div className="flex items-center gap-x-2">
					{/* Add date range picker here */}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
				<div className="bg-white p-4 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-bold">Total Users</h3>
					<p className="text-2xl">{users.length}</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-bold">New Registered Users</h3>
					<p className="text-2xl">{newUsers}</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-bold">Active Refund Requests</h3>
					<p className="text-2xl">{activeRefunds}</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow-md text-center">
					<h3 className="text-lg font-bold">Opened Tickets</h3>
					<p className="text-2xl">{openTickets}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div className="bg-white p-4 rounded-lg shadow-md">
					<h2 className="text-lg font-bold mb-2">Earnings & Refunds</h2>
					<PieChart width={400} height={400}>
						<Pie
							data={earningsData}
							cx={200}
							cy={200}
							labelLine={false}
							label
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{earningsData.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</div>

				<div className="bg-white p-4 rounded-lg shadow-md">
					<h2 className="text-lg font-bold mb-2">Revenue Breakdown by Category</h2>
					<PieChart width={400} height={400}>
						<Pie
							data={revenueByCategoryData}
							cx={200}
							cy={200}
							labelLine={false}
							label
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{revenueByCategoryData.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div className="bg-white p-4 rounded-lg shadow-md">
					<h2 className="text-lg font-bold mb-2">Monthly Revenue Trend</h2>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={monthlyRevenueData}>
							<CartesianGrid stroke="#ccc" />
							<XAxis dataKey="month" />
							{/* <YAxis /> */}
							<Tooltip />
							<Line type="monotone" dataKey="revenue" stroke="#8884d8" />
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="bg-white p-4 rounded-lg shadow-md">
					<h2 className="text-lg font-bold mb-2">Top Selling Products</h2>
					<BarChart width={400} height={300} data={topSellingProducts}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="sales" fill="#8884d8" />
					</BarChart>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 gap-4 mb-4">
				<TopShippingCategories />
				<PeakOrderTimes />
				<MostPopularStates />
				<TopReferralUsers />
			</div>

			<div className="grid grid-cols-1 md:grid-col-2  lg:grid-cols-4 gap-4 mb-4">
				<PaymentMethodsBreakdown />
				<Profits />
				<RefundedOrders />
				<RefundsByCarrier />
			</div>
		</div>
	);
}
export default AdminDashboard;