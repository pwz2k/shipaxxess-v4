import Meta from "@client/components/common/meta";
import OverviewSection from "./components/OverviewSection";
import TopPayments from "./components/TopPayments";
import TopServices from "./components/TopServices";
import TopUps from "./components/TopUps";
import TopStates from "./components/TopStates";

const getRandomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

// Sample data for demonstration
const samplePayments = [
	{ id: 1, name: 'Monthly Subscription', amount: 50, date: '2024-05-15', method: 'Credit Card', status: 'Completed', recipient: 'Netflix' },
	{ id: 2, name: 'Online Purchase', amount: 120, date: '2024-05-14', method: 'PayPal', status: 'Completed', recipient: 'Amazon' },
	{ id: 3, name: 'Utility Bill', amount: 80, date: '2024-04-12', method: 'Bank Transfer', status: 'Completed', recipient: 'Utility Company' },
	{ id: 4, name: 'Monthly Subscription', amount: 50, date: '2024-04-15', method: 'Credit Card', status: 'Completed', recipient: 'Netflix' },
	{ id: 5, name: 'Online Purchase', amount: 120, date: '2024-03-14', method: 'PayPal', status: 'Completed', recipient: 'Amazon' },
	{ id: 6, name: 'Utility Bill', amount: 80, date: '2024-03-12', method: 'Bank Transfer', status: 'Completed', recipient: 'Utility Company' },
	{ id: 7, name: 'Utility Bill', amount: 80, date: '2024-04-12', method: 'Bank Transfer', status: 'Completed', recipient: 'Utility Company' },
	{ id: 8, name: 'Monthly Subscription', amount: 50, date: '2024-04-15', method: 'Credit Card', status: 'Completed', recipient: 'Netflix' },
	{ id: 9, name: 'Online Purchase', amount: 120, date: '2024-03-14', method: 'PayPal', status: 'Completed', recipient: 'Amazon' },
	{ id: 10, name: 'Utility Bill', amount: 80, date: '2024-03-12', method: 'Bank Transfer', status: 'Completed', recipient: 'Utility Company' },
	{ id: 11, name: 'Monthly Subscription', amount: 50, date: '2024-05-15', method: 'Credit Card', status: 'Completed', recipient: 'Netflix' },
	{ id: 12, name: 'Online Purchase', amount: 120, date: '2024-05-14', method: 'PayPal', status: 'Completed', recipient: 'Amazon' },
];

const sampleServices = [
	{ id: 1, name: 'Service A' },
	{ id: 2, name: 'Service B' },
	{ id: 3, name: 'Service C' },
	{ id: 4, name: 'Service D' },
	{ id: 5, name: 'Service E' },
	{ id: 1, name: 'Service A' },
	{ id: 2, name: 'Service B' },
	{ id: 3, name: 'Service C' },
	{ id: 4, name: 'Service D' },
	{ id: 5, name: 'Service E' },
];

const sampleTopUps = [
	{ id: 1, name: 'TopUp 1' },
	{ id: 2, name: 'TopUp 2' },
	{ id: 3, name: 'TopUp 3' }
];

const sampleStates = [
	{ id: 1, name: 'New York' },
	{ id: 2, name: 'California' },
	{ id: 3, name: 'Texas' },
	{ id: 1, name: 'New York' },
	{ id: 2, name: 'California' },
	{ id: 3, name: 'Texas' },
	{ id: 2, name: 'California' },
	{ id: 3, name: 'Texas' },
	{ id: 1, name: 'New York' },
	{ id: 2, name: 'California' },
	{ id: 3, name: 'Texas' }
];

const DashboardUserPage = () => {
	return (
		<>
			<Meta title="Dashboard" />
			<div className="px-4 py-8 space-y-8 h-screen relative">
				<h1 className="text-3xl font-bold px-4">Dashboard</h1>
				<div className="flex flex-row fixed top-0 w-full bg-white shadow-md z-10">
				</div>

				{/* Overview Section */}
				<div className="px-4">
					<h2 className="text-lg font-bold mb-4">Overview</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-1">
						<OverviewSection title="Current Balance" value={getRandomNumber(1000, 10000)} />
						<OverviewSection title="Total Spend" value={getRandomNumber(500, 5000)} />
						<OverviewSection title="Total Refund" value={getRandomNumber(100, 1000)} />
						<OverviewSection title="Referral Balance" value={getRandomNumber(500, 5000)} />
					</div>
				</div>
				<div className="px-4">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 flex-1">
						<TopPayments payments={samplePayments} />
						<TopServices services={sampleServices} />

					</div>
				</div>
				<div className="px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
						<TopUps topUps={sampleTopUps} />
						<TopStates states={sampleStates} />
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardUserPage;
