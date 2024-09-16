import React, { useState } from "react";
import GenericLineChart from "./components/DottedLinechart";

import OverviewSection from "./components/OverviewSection";
import Title from "@client/components/common/title";
import { Boxes, LayoutDashboardIcon, Share2, Truck, Plane, MailWarning } from "lucide-react";
// import CustomDateRangePicker from "../../../components/common/CustomDatePicker";
// import TopRegions from "./components/TopRegions";
import TransactionHistory from "./components/TransactionHistory";
// import ServicePieChart from "./components/Services";
// import DateBarChart from "./components/Zone";
import { UseGet } from "@client/hooks/useGet";
import {  DateRangePicker } from "react-date-range";
import { startOfMonth } from "date-fns";
import { Button } from "@client/components/ui/button";
import TopRegions from "./components/TopRegions";
import { predefinedRanges } from "@client/data/layout";

const DashboardStats: React.FC = () => {
	const getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	const queryKey = "user-dashboard";

	const today = new Date();

	// Set initial date range for the current month
	const initialState = [
		{
			startDate: startOfMonth(today),
			endDate: today,
			key: "selection",
		},
	];

	const [state, setState] = useState(initialState);

	const [showDateRange, setShowDateRange] = useState<boolean>(false);

	const startDate = state[0].startDate.toISOString();
	const endDate = state[0].endDate.toISOString();

	const { data, isLoading, refetch } = UseGet(queryKey, `/user/dashboard?startDate=${startDate}&endDate=${endDate}`);

	console.log(data, "dashboard data");

	

	const generateUpDownData = (labels: string[]) => {
		const midPoint = Math.floor(labels.length / 2);
		return labels.map((label, index) => {
			let baseValue;
			if (index <= midPoint) {
				baseValue = 200 + (index / midPoint) * 800; // Increase to peak
			} else {
				baseValue = 200 + (1 - (index - midPoint) / midPoint) * 800; // Decrease from peak
			}
			const fluctuations = Math.floor(Math.random() * 100) - 50; // Random number between -50 and 50
			const value = baseValue + fluctuations;
			return {
				label,
				value: Math.max(0, value), // Ensure value is not negative
			};
		});
	};

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const totalPaymentsData = generateUpDownData(months);

	// const handleDateChange = (date: any) => {
	// 	console.log(date);
	// };

	return (
		<>
			{isLoading ? (
				<div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			) : (
				<>
					<div className="px-4">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-x-1 py-5 sticky top-0 ">
								<LayoutDashboardIcon size={24} />
								<Title title="Dashboard" />
							</div>
							<Button onClick={() => setShowDateRange(!showDateRange)}>Change Date</Button>
							{showDateRange && (
								<div
									onKeyDown={() => setShowDateRange(false)}
									className="shadow-2xl z-[999] absolute right-0 top-40 flex flex-col">
									<DateRangePicker
										staticRanges={predefinedRanges}
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										onChange={(item: any) => setState([item?.selection])}
										ranges={state}
										inputRanges={[]} // Pass the empty inputRanges here
										showMonthAndYearPickers={true}
										direction="vertical"
										maxDate={new Date()}
									/>
									<div className="bg-white  flex justify-center pb-2">
										<Button
											onClick={() => [setShowDateRange(false), refetch()]}
											className="bg-primary w-24 text-sm h-8 mx-auto text-white py-2 rounded-md">
											Done
										</Button>
									</div>
								</div>
							)}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 flex-1">
							{/* <OverviewSection title="Current Balance" value={getRandomNumber(1000, 10000)} icon={<CreditCard />} /> */}
							<OverviewSection title="Total Spend" value={data?.staticsCard?.totalSpend} />
							<OverviewSection title="Total Refund" value={data?.staticsCard?.totalRefund} />
							<OverviewSection title="Referral Balance" value={data?.staticsCard?.referlBalance} icon={<Share2 />} />
						</div>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
						<div className="col-span-1 h-full">
							<div className="flex flex-col h-full gap-y-6">
								<OverviewSection
									title="Total Shipping Cost"
									value={getRandomNumber(1000, 10000)}
									linkText={"View Transactions"}
								/>
								{/* <OverviewSection title="Carrier Adjustment" value={-5.9} linkText={"View All Adjustment"} /> */}
								{/* <OverviewSection
									title="Pending Refund"
									value={data?.staticsCard?.pendingRefund?.total}
									linkText={"View Refund History"}
								/> */}

								<div className="bg-gray-200 p-4 rounded transition duration-300 hover:shadow-lg">
									<h1 className="text-2xl font-bold mb-2">Pending Refund </h1>
									<div className="flex justify-start items-center gap-2 font-bold text-gray-600 text-xl  mb-2 ">
										<h2>
											${data?.staticsCard?.pendingRefund?.amount}{" "}
											<span className="text-md font-semibold">({data?.staticsCard?.pendingRefund?.total} Labels) </span>
										</h2>
									</div>
								</div>
							</div>
						</div>
						<div className="col-span-1 lg:col-span-2">
							<GenericLineChart
								data={totalPaymentsData}
								title="Total Payments"
								valueKey="value"
								icon={<Boxes size={24} />}
								xAxisLink="/payments"
							/>
						</div>
						<div className="col-span-1 lg:col-span-2">
							<GenericLineChart
								data={data.averageCost}
								title="Average Cost"
								valueKey="value"
								icon={<Boxes size={24} />}
								height={260}
								xAxisLink="/cost"
							/>
						</div>
						<div className="col-span-1 h-full">
							<div className="flex flex-col h-full mt-4  gap-y-10">
								<OverviewSection
									title="Avg. Domestic"
									value={getRandomNumber(1000, 10000)}
									linkText={"View Shipments"}
									icon={<Truck size={24} />}
								/>
								<OverviewSection
									title="Avg. International"
									value={getRandomNumber(1000, 10000)}
									linkText={"View Shipments "}
									icon={<Plane size={24} />}
								/>
							</div>
						</div>
						<div className="col-span-1 h-full">
							<div className="flex flex-col h-full mt-4  gap-y-10">
								<OverviewSection
									title="New Shipments"
									value={getRandomNumber(1000, 10000)}
									linkText={"View Shipments"}
								/>
								<OverviewSection
									title="Delivery Issues"
									value={getRandomNumber(1000, 10000)}
									linkText={"View Undeliverable Shipments "}
									icon={<MailWarning size={24} />}
								/>
							</div>
						</div>
						<div className="col-span-1 lg:col-span-2">
							<GenericLineChart
							isDollarIcon={false}
								data={data?.monthlyShipments.map((item: { date: string; value: number }) => ({
									label: item.date,
									value: item.value,
								}))}
								title="Total Shipments"
								valueKey="value"
								icon={<Boxes size={24} />}
								height={280}
								xAxisLink="/shipments"
							/>
						</div>
						<div className="lg:col-span-1  col-span-1">{/* <ServicePieChart /> */}</div>
						<div className="lg:col-span-2 col-span-1">{/* <DateBarChart /> */}</div>

						<div className="col-span-1 lg:col-span-3">
							<TopRegions topStates={data?.topstates} topCountries={[]} />
						</div>
						<div className="col-span-1 lg:col-span-3 pb-10">
							<TransactionHistory data={data?.transcationHistory} />
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default DashboardStats;
