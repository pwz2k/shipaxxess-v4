import React, { useState } from "react";
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
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
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
import TopSpentUsers from "./components/TopSpentUser";
import { createStaticRanges, DateRangePicker } from "react-date-range";
import {  endOfMonth, endOfYear, startOfMonth, startOfYear, subDays, subYears } from "date-fns";
import { Button } from "@client/components/ui/button";
const AdminDashboard: React.FC = () => {
	const queryKey = "admin-dashboard";
	const { data, isLoading } = UseGet(queryKey, "/admin/dashboard");
	console.log("data ds", data);
	const [showDateRange, setShowDateRange] = useState<boolean>(false);
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

	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
		},
	]);

	const predefinedRanges = createStaticRanges([
		{
			label: "Today",
			range: () => ({
				startDate: new Date(),
				endDate: new Date(),
			}),
		},
		{
			label: "Yesterday",
			range: () => ({
				startDate: subDays(new Date(), 1),
				endDate: subDays(new Date(), 1),
			}),
		},
		{
			label: "Last 7 Days",
			range: () => ({
				startDate: subDays(new Date(), 6),
				endDate: new Date(),
			}),
		},
		{
			label: "Last 30 Days",
			range: () => ({
				startDate: subDays(new Date(), 29),
				endDate: new Date(),
			}),
		},
		{
			label: "This Month",
			range: () => ({
				startDate: startOfMonth(new Date()),
				endDate: endOfMonth(new Date()),
			}),
		},
		{
			label: "Last Month",
			range: () => ({
				startDate: startOfMonth(subDays(new Date(), 30)),
				endDate: endOfMonth(subDays(new Date(), 30)),
			}),
		},
		{
			label: "Last 3 Months",
			range: () => ({
				startDate: subDays(new Date(), 90),
				endDate: new Date(),
			}),
		},
		{
			label: "Last 6 Months",
			range: () => ({
				startDate: subDays(new Date(), 180),
				endDate: new Date(),
			}),
		},
		
			{
				label: "Last 1 Year",
				range: () => ({
					startDate: startOfYear(subYears(new Date(), 1)),
					endDate: endOfYear(subYears(new Date(), 1)),
				}),
			},
	
		
	]);

	console.log(state);

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
					<Button onClick={() => setShowDateRange(!showDateRange)}>Change Date</Button>

					{showDateRange && (
						<div
							onKeyDown={() => setShowDateRange(false)}
							className="shadow-2xl z-[999] absolute right-0 top-40 flex flex-col">
							<DateRangePicker
							staticRanges={predefinedRanges}
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								onChange={(item:any) => setState([item?.selection])}
								ranges={state}
								inputRanges={[]} // Pass the empty inputRanges here
								showMonthAndYearPickers={true}
								direction="vertical"
								maxDate={new Date()}
							/>
							<div className="bg-white  flex justify-center pb-2">
								<Button
									onClick={() => setShowDateRange(false)}
									className="bg-primary w-24 text-sm h-8 mx-auto text-white py-2 rounded-md">
									Done
								</Button>
							</div>
						</div>
					)}
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
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
					<div className="bg-white p-4 rounded-lg shadow-md text-center">
						<h3 className="text-lg font-bold">Refunded Orders Amount</h3>
						<p className="text-2xl">{data?.statisticCard?.refundedOrdersAmount}</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow-md text-center">
						<h3 className="text-lg font-bold">Pending Refunded Amount</h3>
						<p className="text-2xl">{data?.statisticCard?.pendingRefundedAmount}</p>
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
									{data?.earningRefunds?.map((_entry: { name: string; value: number }, index: number) => (
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
									{data?.revenueByCategory?.map((_entry: { name: string; value: number }, index: number) => (
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
					<TopSpentUsers topSpentUsersData={data?.topUsers} />
				</div>
			</div>
		</>
	);
};
export default AdminDashboard;
