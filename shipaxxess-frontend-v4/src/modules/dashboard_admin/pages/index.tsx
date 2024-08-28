import React from "react";
import Title from "@client/components/common/title";
import { LayoutDashboardIcon } from "lucide-react";
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
} from "recharts";

// Importing the new components
import TopShippingCategories from "./components/TopShippingCategories";
import PeakOrderTimes from "./components/PeakOrderTimes";
import MostPopularStates from "./components/MostPopularStates";
import TopReferralUsers from "./components/TopReferralUsers";
import PaymentMethodsBreakdown from "./components/PaymentMethodsBreakdown";
import Profits from "./components/Profits";
import RefundedOrders from "./components/RefundedOrders";
import RefundsByCarrier from "./components/RefundsByCarrier";
import { UseGet } from "@client/hooks/useGet";

const AdminDashboard: React.FC = () => {
	const queryKey = "admin-dashboard";
	const { data, isLoading } = UseGet(queryKey, "/admin/dashboard");
	console.log("data ds", data);

	const COLORS = ["#0088FE", "#00C49F"];
	const CATEGORY_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	const formatMonth = (month: string): string => {
		const monthAbbreviations: { [key: string]: string } = {
			January: "Jan",
			February: "Feb",
			March: "Mar",
			April: "Apr",
			May: "May",
			June: "Jun",
			July: "Jul",
			August: "Aug",
			September: "Sep",
			October: "Oct",
			November: "Nov",
			December: "Dec",
		};
		return monthAbbreviations[month] || month;
	};

	return (
		<>
			{isLoading && (
				<div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			)}

			<div className="px-4 py-4 bg-gray-100 min-h-screen">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-x-2">
						<LayoutDashboardIcon size={24} />
						<Title title="Admin Dashboard" />
					</div>
					<div className="flex items-center gap-x-2">{/* Add date range picker here */}</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
					<div className="bg-white p-4 rounded-lg shadow-md text-center">
						<h3 className="text-lg font-bold">Total Users</h3>
						<p className="text-2xl">{data?.statisticCard?.totalUsers}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-md text-center">
						<h3 className="text-lg font-bold">New Registered Users</h3>
						<p className="text-2xl">{data?.statisticCard?.newlyRegisteredUsers}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-md text-center">
						<h3 className="text-lg font-bold">Active Refund Requests</h3>
						<p className="text-2xl">${data?.statisticCard?.refundsRequests}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-md text-center">
						<h3 className="text-lg font-bold">Opened Tickets</h3>
						<p className="text-2xl">{data?.statisticCard?.openTickets}</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div className="bg-white p-4 rounded-lg shadow-md">
						<h2 className="text-lg font-bold mb-2">Earnings & Refunds</h2>
						<ResponsiveContainer width="100%" height={400}>
							<PieChart>
								<Pie
									data={data?.earningRefunds}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) => `${name}: ${value}`}
									outerRadius={120}
									innerRadius={80}
									fill="#8884d8"
									dataKey="value">
									{data?.earningRefunds?.map((_entry: any, index: number) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Legend verticalAlign="bottom" height={15} />
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>

					<div className="bg-white p-4 rounded-lg shadow-md">
						<h2 className="text-lg font-bold mb-2">Revenue Breakdown by Category</h2>
						<ResponsiveContainer width="100%" height={400}>
							<PieChart>
								<Pie
									data={data?.revenueByCategory}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) => `${name}: ${value}`}
									outerRadius={120}
									innerRadius={80}
									fill="#8884d8"
									dataKey="value">
									{data?.revenueByCategory?.map((_entry: any, index: number) => (
										<Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
									))}
								</Pie>
								<Legend verticalAlign="bottom" height={15} />
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div className="bg-white p-4 rounded-lg shadow-md">
						<h2 className="text-lg font-bold mb-2">Monthly Revenue Trend</h2>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={data?.monthlyRevenue}>
								{console.log("dd", data?.monthlyRevenue)}
								<CartesianGrid stroke="#ccc" />
								<XAxis dataKey="name" textAnchor="middle" tickFormatter={formatMonth} />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="value" stroke="#8884d8" />
							</LineChart>
						</ResponsiveContainer>
					</div>

					<div className="bg-white p-4 col-span-1 rounded-lg shadow-md w-full">
						<h2 className="text-lg font-bold mb-2">Top Selling Products</h2>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart width={1000} height={300} data={data?.topSellingProducts}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								{/* <YAxis /> */}
								<Tooltip />
								<Legend />
								<Bar dataKey="value" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-col-2 lg:grid-cols-4 gap-4 mb-4">
					<TopShippingCategories shippingCategoriesData={data?.shippingCategories} />
					<PeakOrderTimes peakOrderTimesData={data?.peakOrderTime} />
					<MostPopularStates popularStatesData={data?.popularStates} />
					<TopReferralUsers referralUsersData={data?.referralUsers} />
				</div>

				<div className="grid grid-cols-1 md:grid-col-2  lg:grid-cols-4 gap-4 mb-4">
					<PaymentMethodsBreakdown paymentMethodsData={data?.paymentMethods} />
					<Profits profitsData={data?.profits} />
					<RefundedOrders refundedOrdersData={data?.refundedOrders} />
					<RefundsByCarrier refundsByCarrierData={data?.refundsByCarrier} />
				</div>
			</div>
		</>
	);
};
export default AdminDashboard;
