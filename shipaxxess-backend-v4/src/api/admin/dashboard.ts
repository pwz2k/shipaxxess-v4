import { batchs } from "@schemas/batchs";
import { tickets } from "@schemas/tickets";

import { users } from "@schemas/users";
import { count, desc, eq, sql } from "drizzle-orm";
import { drizzle, } from "drizzle-orm/d1";
import { Context } from "hono";
interface Order {
	id: number;
	created_at: string; // Assuming ISO 8601 datetime format
}
export const Get = async (c: Context<App>) => {
	const db = drizzle(c.env.DB);
	const totalUsers = await db.select({
		count: count()
	}).from(users);

	const OpenTicket = await db.select({
		count: count()
	}).from(tickets).where(eq(tickets.status, "active"));
	// calculate the peak order time from the batchs table using batch table
	const peakOrderTime = await db.select({
		timeFrame: sql`strftime('%Y-%m-%d %H', created_at)`, // Format the datetime to 'YYYY-MM-DD HH'
		orderCount: count()
	})
		.from(batchs)
		// .where(eq(batchs.status_label, "active")) // Assuming 'active' batches are what you're interested in
		.groupBy(sql`strftime('%Y-%m-%d %H', created_at)`)
		.orderBy(desc(count()))
		.limit(24)
	const formattedPeakOrderTime = peakOrderTime.map((order: any) => {
		const parts = order.timeFrame.split(' ');
		const datePart = parts[0];
		let timePart = parts[1];

		// Splitting hours and minutes
		const [hours, minutes] = timePart.split(':');
		return {
			// convert the time to 24 and append the 00 at the end
			hours: `${hours}:00`,
			orders: order.orderCount
		}

	})
	console.log("formattedPeakOrderTime", formattedPeakOrderTime)

	const payload = {
		// staticcard data
		statisticCard: {
			totalUsers: totalUsers[0].count,
			newlyRegisteredUsers: 4,
			openTickets: OpenTicket[0].count,
			refundsRequests: 200,

		},
		earningRefunds: [{ name: "Total Earnings", value: 300 }, { name: "Refunds", value: 200 }],
		revenueByCategory: [{ name: "Category A", value: 400 }, { name: "Category B", value: 300 }, { name: "Category C", value: 300 }],
		monthlyRevenue: [{ name: "January", value: 400 }, { name: "February", value: 300 }, { name: "March", value: 300 }, { name: "April", value: 200 }, { name: "May", value: 100 }, { name: "June", value: 50 }, { name: "July", value: 40 }, { name: "August", value: 30 }, { name: "September", value: 20 }, { name: "October", value: 10 }, { name: "November", value: 5 }, { name: "December", value: 8 }],
		topSellingProducts: [{ name: "Product A", value: 400 }, { name: "Product B", value: 300 }, { name: "Product C", value: 300 }, { name: "Product D", value: 200 }],
		shippingCategories: [{ name: "Electronics", value: 400 }, { name: "Fashion", value: 300 }, { name: "Home & Garden", value: 300 }, { name: "Sports", value: 200 }],
		peakOrderTime: formattedPeakOrderTime,
		popularStates: [{ state: 'California', orders: 400 }, { state: 'Texas', orders: 300 }, { state: 'New York', orders: 200 }, { state: 'Florida', orders: 100 }, { state: 'Illinois', orders: 50 }, { state: 'Pennsylvania', orders: 40 }, { state: 'Ohio', orders: 30 }, { state: 'Georgia', orders: 20 }, { state: 'North Carolina', orders: 10 }, { state: 'Michigan', orders: 5 }, { state: 'New Jersey', orders: 8 }],
		referralUsers: [
			{ id: 1, name: 'User 1', fullName: 'Full Name 1', email: 'user1@example.com', timeZone: 'GMT', referrals: 30, joined: '2022-01-01', status: 'Active' },
			{ id: 2, name: 'User 2', fullName: 'Full Name 2', email: 'user1@example.com', timeZone: 'GMT', referrals: 25, joined: '2022-01-01', status: 'Active' },
			{ id: 3, name: 'User 3', fullName: 'Full Name 3', email: 'user1@example.com', timeZone: 'GMT', referrals: 20, joined: '2022-01-01', status: 'Active' },
			{ id: 4, name: 'User 4', fullName: 'Full Name 4', email: 'user1@example.com', timeZone: 'GMT', referrals: 15, joined: '2022-01-01', status: 'Active' },
			{ id: 5, name: 'User 5', fullName: 'Full Name 5', email: 'user2@gmail.com', timeZone: 'GMT', referrals: 10, joined: '2022-01-01', status: 'Active' },

		],
		paymentMethods: [
			{ name: 'Credit Card', value: 400 },
			{ name: 'PayPal', value: 300 },
			{ name: 'Bank Transfer', value: 200 },
			{ name: 'Cash', value: 100 },
		],
		profits: [{ month: 'Jan', profit: 400 },
		{ month: 'Feb', profit: 300 },
		{ month: 'Mar', profit: 200 },
		{ month: 'Apr', profit: 278 }],

		refundedOrders: [{ month: 'Jan', orders: 400 }, { month: 'Feb', orders: 300 }, { month: 'Mar', orders: 200 }, { month: 'Apr', orders: 278 }, { month: 'May', orders: 189 }, { month: 'Jun', orders: 239 }, { month: 'Jul', orders: 349 }, { month: 'Aug', orders: 200 }, { month: 'Sep', orders: 300 }, { month: 'Oct', orders: 400 }, { month: 'Nov', orders: 500 }, { month: 'Dec', orders: 600 }],
		refundsByCarrier: [{ name: 'UPS', value: 400 }, { name: 'FedEx', value: 300 }, { name: 'DHL', value: 300 }, { name: 'USPS', value: 200 }],


	}

	// Return the payload as a JSON response
	return c.json(payload);
};

export const DashboardAdmin = { Get };
