import { batchs } from "@schemas/batchs";
import { payments } from "@schemas/payments";
import { tickets } from "@schemas/tickets";

import { users } from "@schemas/users";
import { and, count, desc, eq, gt, not, sql } from "drizzle-orm";
import { drizzle, } from "drizzle-orm/d1";
import { Context } from "hono";
interface Order {
	id: number;
	created_at: string; // Assuming ISO 8601 datetime format
}
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
		const [hours, minutes] = timePart.split(':');
		return {

			hours: `${hours}:00`,
			orders: order.orderCount
		}

	})
	// compute paymentMethods and each method total value using payments table
	const totalAmountByGateway = await db.select({
		name: payments.gateway,
		value: sql`SUM(${payments.credit})` // Sum the credit for each gateway
	}).from(payments)
		.where(and(not(eq(payments.gateway, "Label")), not(eq(payments.gateway, "Refund")))) // Exclude third-party API payments and refunds
		.groupBy(payments.gateway) // Group by gateway only, not by user_id
		.orderBy(payments.gateway);

	console.log(totalAmountByGateway, "totalAmountByGateway");

	// compute refunder orders using batchs table by each month by name
	const refundedOrders = await db.select({
		month: sql`strftime('%m', created_at)`,
		orders: count()
	}).from(batchs)
		.groupBy(sql`strftime('%m', created_at)`)
		.orderBy(desc(count()));

	const formattedRefundedOrders = refundedOrders.map((order: any) => {
		const month = monthNames[parseInt(order.month) - 1];
		return {
			month,
			orders: order.orders
		}
	})
	// compute  refundsByCarrier using batchs table by each carrier
	const refundsByCarrier = await db.select({
		name: batchs.type,
		value: count()
	}).from(batchs)
		.groupBy(batchs.type)
		.orderBy(desc(count()));

	// return the top 10 referralUsers that referred the most users if user not refer any it refer_from is null
	const topReferralUsers = await db.select({
		id: users.id,
		name: users.first_name,
		fullName: users.last_name,
		email: users.email_address,
		timeZone: users.timezone,
		referrals: count(users.refer_from),
		joined: users.created_at,
		status: users.email_verified,
		uuid: users.uuid,



	}).from(users).where(gt(users, 0)).execute();





	const payload = {
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
		referralUsers: topReferralUsers,
		paymentMethods: totalAmountByGateway,
		profits: [{ month: 'Jan', profit: 400 },
		{ month: 'Feb', profit: 300 },
		{ month: 'Mar', profit: 200 },
		{ month: 'Apr', profit: 278 }],

		refundedOrders: formattedRefundedOrders,
		refundsByCarrier: refundsByCarrier

	}

	// Return the payload as a JSON response
	return c.json(payload);
};

export const DashboardAdmin = { Get };
