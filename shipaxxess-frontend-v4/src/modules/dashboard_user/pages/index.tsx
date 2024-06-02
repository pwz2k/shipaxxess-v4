import React, { useState, useEffect } from 'react';
import TopStatesBarChart from './components/TopStatesBarChart';
import PendingRefundsCard from './components/PendingRefundsCard';
import AverageCostCard from './components/AverageCostCard';
import TotalShipmentsLineChart from './components/TotalShipmentsLineChart';
import OverviewSection from './components/OverviewSection';
import Title from '@client/components/common/title';
import { CreditCard, LayoutDashboardIcon, Share2 } from 'lucide-react';
import DateRangePicker from '../../../components/common/DateRangePicker';

const DashboardStats: React.FC = () => {
	const getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	// State for loading
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Simulating data loading with setTimeout
	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timeout);
	}, []);

	// State for date range
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	// Handle date change
	const handleDateChange = (start: Date | null, end: Date | null) => {
		setStartDate(start);
		setEndDate(end);
	};

	return (
		<>
			{/* Overlay and backdrop when loading */}
			{isLoading && (
				<div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
				</div>
			)}

			<div className="px-4">
				<div className='flex justify-between'>
					<div className='flex items-center gap-x-1 sticky top-0 '>
						<LayoutDashboardIcon size={24} />
						<Title title="Dashboard" />
					</div>
					<DateRangePicker
						_startDate={startDate}
						_endDate={endDate}
						onDateChange={handleDateChange}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-1">
					<OverviewSection title="Current Balance" value={getRandomNumber(1000, 10000)} icon={<CreditCard />} />
					<OverviewSection title="Total Spend" value={getRandomNumber(500, 5000)} />
					<OverviewSection title="Total Refund" value={getRandomNumber(100, 1000)} />
					<OverviewSection title="Referral Balance" value={getRandomNumber(500, 5000)} icon={<Share2 />} />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="col-span-1 lg:col-span-2">
					<TopStatesBarChart />
				</div>
				<div className="col-span-1">
					<PendingRefundsCard />
				</div>
				<div className="col-span-1">
					<AverageCostCard />
				</div>
				<div className="col-span-1 lg:col-span-2">
					<TotalShipmentsLineChart />
				</div>
			</div>
		</>
	);
};

export default DashboardStats;
