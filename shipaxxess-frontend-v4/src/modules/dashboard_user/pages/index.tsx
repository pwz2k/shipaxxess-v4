
import React from 'react';
import TopStatesBarChart from './components/TopStatesBarChart';
import PendingRefundsCard from './components/PendingRefundsCard';
import AverageCostCard from './components/AverageCostCard';
import TotalShipmentsLineChart from './components/TotalShipmentsLineChart';
import OverviewSection from './components/OverviewSection';
import Title from '@client/components/common/title';
import { DivideSquare, LayoutDashboardIcon } from 'lucide-react';

const DashboardStats: React.FC = () => {
	const getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	return (
		<>
			<div className="px-4">
				{/* <h1 className="text-lg font-bold mb-4">Dashboard</h1> */}
				<div className='py-4'>
					<div className='flex items-center gap-x-1'>
						<LayoutDashboardIcon size={24} />
						<Title title="Dashboard" />
					</div>

				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-1">
					<OverviewSection title="Current Balance" value={getRandomNumber(1000, 10000)} />
					<OverviewSection title="Total Spend" value={getRandomNumber(500, 5000)} />
					<OverviewSection title="Total Refund" value={getRandomNumber(100, 1000)} />
					<OverviewSection title="Referral Balance" value={getRandomNumber(500, 5000)} />
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
