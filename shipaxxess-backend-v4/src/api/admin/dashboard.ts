import { refunds } from "@schemas/refunds";
import { tickets } from "@schemas/tickets";
import { users } from "@schemas/users";
import { count, eq } from "drizzle-orm";
import { drizzle, } from "drizzle-orm/d1";
import { Context } from "hono";

export const Get = async (c: Context<App>) => {
	const db = drizzle(c.env.DB);
	const totalUsers = await db.select({
		count: count()
	}).from(users);

	const OpenTicket = await db.select({
		count: count()
	}).from(tickets).where(eq(tickets.status, "active"));
	// active refund requests
	const refundsRequests = await db.select().from(refunds).where(eq(refunds.is_refunded, false));


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
		peakOrderTime: [
			{ hour: '00:00', orders: 30 },
			{ hour: '01:00', orders: 20 },
			{ hour: '02:00', orders: 10 },
			{ hour: '03:00', orders: 5 },
			{ hour: '04:00', orders: 8 },
			{ hour: '05:00', orders: 15 },
			{ hour: '06:00', orders: 20 },
			{ hour: '07:00', orders: 30 },
			{ hour: '08:00', orders: 40 },
			{ hour: '09:00', orders: 50 },
			{ hour: '10:00', orders: 60 },
			{ hour: '11:00', orders: 70 },
			{ hour: '12:00', orders: 80 },
			{ hour: '13:00', orders: 90 },
			{ hour: '14:00', orders: 100 },
			{ hour: '15:00', orders: 110 },
			{ hour: '16:00', orders: 120 },
			{ hour: '17:00', orders: 130 },
			{ hour: '18:00', orders: 140 },
			{ hour: '19:00', orders: 150 },
			{ hour: '20:00', orders: 160 },
			{ hour: '21:00', orders: 170 },
			{ hour: '22:00', orders: 180 },
			{ hour: '23:00', orders: 190 },

		],
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
