import { weightsRelations } from "./../../database/drizzle-orm/schemas/relations";
import { addresses } from "@schemas/addresses";
import { adminWeights } from "@schemas/adminWeights";
import { batchs } from "@schemas/batchs";
import { payments } from "@schemas/payments";
import { refunds } from "@schemas/refunds";
import { tickets } from "@schemas/tickets";

import { users } from "@schemas/users";
import { weights } from "@schemas/weights";
import { and, count, desc, eq, gt, not, sql, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
interface Order {
	id: number;
	created_at: string; // Assuming ISO 8601 datetime format
}
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const Get = async (c: Context<App>) => {
	const db = drizzle(c.env.DB);

	const { startDate, endDate } = c.req.query();

	if (!startDate || !endDate) {
		return c.json({ error: "startDate and endDate are required" }, 400);
	}

	const start = new Date(startDate);
	const end = new Date(endDate);






	if (start.toDateString() === end.toDateString()) {
		// Set startDate to the first second of the day
		start.setHours(0, 0, 0, 0);
	
		// Set endDate to the last second of the day
		end.setHours(23, 59, 59, 999);
	} else {
		// Check if both dates are "yesterday"
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
	
		if (
			start.toDateString() === yesterday.toDateString() &&
			end.toDateString() === yesterday.toDateString()
		) {
			// Set startDate to the first second of "yesterday"
			start.setHours(0, 0, 0, 0);
	
			// Set endDate to the last second of "yesterday"
			end.setHours(23, 59, 59, 999);
		}
	}






	console.log(start, end);
	const totalUsers = await db
		.select({
			count: count(),
		})
		.from(users);

	const OpenTicket = await db
		.select({
			count: count(),
		})
		.from(tickets)
		.where(
			and(
				eq(tickets.status, "active"),
				sql`${tickets.created_at} >= ${start.toISOString()}`,
				sql`${tickets.created_at} <= ${end.toISOString()}`,
			),
		);
	const today = new Date().toISOString().split("T")[0];
	// calculate the peak order time from the batchs table using batch table
	const peakOrderTime = await db
		.select({
			timeFrame: sql`strftime('%Y-%m-%d %H', created_at)`, // Format the datetime to 'YYYY-MM-DD HH'
			orderCount: count(),
		})
		.from(batchs)
		.where(sql`strftime('%Y-%m-%d', created_at) = ${today}`) // Filter by today's date
		.groupBy(sql`strftime('%Y-%m-%d %H', created_at)`)
		.orderBy(sql`strftime('%H', created_at)`); // Order by hour

	const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

	const formattedPeakOrderTime = hours.map((hour) => {
		// Extract only the hour part for comparison
		const found = peakOrderTime.find((order: any) => {
			const orderHour = order.timeFrame.split(" ")[1] + ":00"; // Add ":00" to match with 'hours'
			return orderHour === hour;
		});

		return {
			hours: hour,
			orders: found ? found.orderCount : 0,
		};
	});

	// compute paymentMethods and each method total value using payments table
	const totalAmountByGateway = await db
		.select({
			name: payments.gateway,
			// add $ sign to the value to show that it is a currency
			value: sql`SUM(${payments.credit})`,
		})
		.from(payments)
		.where(
			and(
				not(eq(payments.gateway, "Label")),
				not(eq(payments.gateway, "Refund")),
				sql`${payments.created_at} >= ${start.toISOString()}`,
				sql`${payments.created_at} <= ${end.toISOString()}`,
			),
		) // Exclude third-party API payments and refunds
		.groupBy(payments.gateway) // Group by gateway only, not by user_id
		.orderBy(payments.gateway);

	// compute refunder orders using batchs table by each month by name
	const refundedOrders = await db
		.select({
			month: sql`strftime('%m', created_at)`,
			orders: count(),
		})
		.from(refunds)
		.where(
			and(
				eq(refunds.is_refunded, true),
				sql`${refunds.created_at} >= ${start.toISOString()}`,
				sql`${refunds.created_at} <= ${end.toISOString()}`,
			),
		)
		.groupBy(sql`strftime('%m', created_at)`)
		.orderBy(desc(count()));

	const formattedRefundedOrders = refundedOrders.map((order: any) => {
		const month = monthNames[parseInt(order.month) - 1];
		return {
			month,
			orders: order.orders,
		};
	});
	// compute  refundsByCarrier using batchs table by each carrier
	const refundsByCarrier = await db
		.select({
			name: batchs.type,
			value: count(batchs.status_refund),
		})
		.from(batchs)
		.groupBy(batchs.type)
		.where(
			and(
				eq(batchs.status_refund, true),
				sql`${batchs.created_at} >= ${start.toISOString()}`,
				sql`${batchs.created_at} <= ${end.toISOString()}`,
			),
		);

	// return the top 10 referralUsers that referred the most users if user not refer any it refer_from is null
	const topReferralUsers = await db
		.select({
			id: users.id,
			name: users.first_name,
			fullName: users.last_name,
			email: users.email_address,
			timeZone: users.timezone,
			referrals: count(users.refer_from),
			joined: users.created_at,
			status: users.email_verified,
			uuid: users.uuid,
		})
		.from(users)
		.where(gt(users, 0))
		.execute();

	const totalEarnings = await db
		.select({
			totalEarnings: sql`SUM(${payments.credit})`,
		})
		.from(payments)
		.where(
			and(
				not(eq(payments.gateway, "Refund")),
				sql`${payments.created_at} >= ${start.toISOString()}`,
				sql`${payments.created_at} <= ${end.toISOString()}`,
			),
		)
		.execute();

	const totalRefunds = await db
		.select({
			totalRefunds: sql`SUM(${payments.credit})`,
		})
		.from(payments)
		.where(
			and(
				eq(payments.gateway, "Refund"),
				sql`${payments.created_at} >= ${start.toISOString()}`,
				sql`${payments.created_at} <= ${end.toISOString()}`,
			),
		)
		.execute();

	const earningRefunds = [
		{ name: "Total Earnings", value: totalEarnings[0].totalEarnings },
		{ name: "Refunds", value: totalRefunds[0].totalRefunds },
	];

	// compute the total profit by summing the total credit in the payment table and subtracting the refunds and lables as expese where gateway is is label and refund in gateway
	const profits = await db
		.select({
			month: sql`strftime('%m', created_at)`,
			profit: sql`SUM(COALESCE(${payments.credit}, 0))`,
		})
		.from(payments)
		.groupBy(sql`strftime('%m', created_at)`)
		.orderBy(desc(sql`strftime('%m', created_at)`))
		.where(
			and(sql`${payments.created_at} >= ${start.toISOString()}`, sql`${payments.created_at} <= ${end.toISOString()}`),
		);

	const profitByMonth = profits.map((profit: any) => {
		const month = monthNames[parseInt(profit.month) - 1];

		return {
			month,
			profit: `$${profit.profit}`,
		};
	});

	// Query batch data
	const batchData = await db
		.select({ recipients: batchs.recipients })
		.from(batchs)
		.where(and(sql`${batchs.created_at} >= ${start.toISOString()}`, sql`${batchs.created_at} <= ${end.toISOString()}`))
		.all();

	// Process recipients
	const stateCount: Record<string, number> = {};
	batchData.forEach((batch: any) => {
		try {
			const recipients = typeof batch.recipients === "string" ? JSON.parse(batch.recipients) : batch.recipients;
			recipients.forEach((recipient: any) => {
				const state = recipient.state;
				if (state) {
					stateCount[state] = (stateCount[state] || 0) + 1;
				}
			});
		} catch (error) {
			console.error("Error parsing recipients JSON:", error);
		}
	});

	// Format and sort the results
	const formattedPopularStates = Object.entries(stateCount)
		.map(([state, count]) => ({ state, orders: count }))
		.sort((a, b) => b.orders - a.orders);

	const topSpenders = await db
		.select({
			first_name: users.first_name,
			last_name: users.last_name,
			total_spent: users.total_spent,
			email: users.email_address,
		})
		.from(users)
		.orderBy(desc(users.total_spent))
		.where(and(sql`${users.created_at} >= ${start.toISOString()}`, sql`${users.created_at} <= ${end.toISOString()}`))
		.limit(10);

	const refundedOrdersAmount = await db
		.select({ count: count(refunds.is_refunded) })
		.from(refunds)
		.where(
			and(
				eq(refunds.is_refunded, true),
				sql`${refunds.created_at} >= ${start.toISOString()}`,
				sql`${refunds.created_at} <= ${end.toISOString()}`,
			),
		);

	const refundsRequests = await db
		.select({ count: count(refunds.is_refunded) })
		.from(refunds)
		.where(
			and(
				eq(refunds.is_refunded, false),
				sql`${refunds.created_at} >= ${start.toISOString()}`,
				sql`${refunds.created_at} <= ${end.toISOString()}`,
			),
		);

	const topShippingCategories = await db
		.select({ value: count(batchs.id), name: batchs.type_value })
		.from(batchs)
		.groupBy(batchs.type_value)
		.where(
			and(
				eq(batchs.status_refund, false),
				sql`${batchs.created_at} >= ${start.toISOString()}`,
				sql`${batchs.created_at} <= ${end.toISOString()}`,
			),
		);
	// .where(eq(batchs.status_refund, false));

	const pendingRefundedAmount = await db
		.select({ count: count(refunds.is_refunded) })
		.from(refunds)
		.where(
			and(
				eq(refunds.is_refunded, false),
				sql`${refunds.created_at} >= ${start.toISOString()}`,
				sql`${refunds.created_at} <= ${end.toISOString()}`,
			),
		);

	const newlyRegisteredUsers = await db
		.select({ count: count(users.email_address) })
		.from(users)
		.where(and(sql`${users.created_at} >= ${start.toISOString()}`, sql`${users.created_at} <= ${end.toISOString()}`));

	const totalProfitsWithType = await db
		.select({
			type: batchs.type,
			profit: sum(sql<number>`((${batchs.cost_user} - ${batchs.cost_reseller}))`).as("total_profit"),
		})
		.from(batchs)
		.where(
			and(
				eq(batchs.status_label, "completed"),
				sql`${batchs.created_at} >= ${start.toISOString()}`,
				sql`${batchs.created_at} <= ${end.toISOString()}`,
			),
		)
		.groupBy(batchs.type)
		.execute();

	const totalProfit = totalProfitsWithType.reduce((acc, data) => acc + Number(data.profit), 0);

	const payload = {
		totalProfitsWithType,
		topUsers: topSpenders,
		profits,
		totalProfit,
		statisticCard: {
			totalUsers: totalUsers[0].count,
			newlyRegisteredUsers: newlyRegisteredUsers[0].count,
			openTickets: OpenTicket[0].count,
			refundedOrdersAmount: refundedOrdersAmount[0].count,
			refundsRequests: refundsRequests[0].count,
			pendingRefundedAmount: pendingRefundedAmount[0].count,
		},
		earningRefunds: earningRefunds,
		revenueByCategory: [
			{ name: "Category A", value: 400 },
			{ name: "Category B", value: 300 },
			{ name: "Category C", value: 300 },
		],
		monthlyRevenue: [
			{ name: "January", value: 400 },
			{ name: "February", value: 300 },
			{ name: "March", value: 300 },
			{ name: "April", value: 200 },
			{ name: "May", value: 100 },
			{ name: "June", value: 50 },
			{ name: "July", value: 40 },
			{ name: "August", value: 30 },
			{ name: "September", value: 20 },
			{ name: "October", value: 10 },
			{ name: "November", value: 5 },
			{ name: "December", value: 8 },
		],
		topSellingProducts: [
			{ name: "Product A", value: 400 },
			{ name: "Product B", value: 300 },
			{ name: "Product C", value: 300 },
			{ name: "Product D", value: 200 },
		],
		shippingCategories: topShippingCategories,
		peakOrderTime: formattedPeakOrderTime,
		popularStates: formattedPopularStates,

		referralUsers: topReferralUsers,
		paymentMethods: totalAmountByGateway,
		profitByMonth: profitByMonth,

		refundedOrders: formattedRefundedOrders,
		refundsByCarrier: refundsByCarrier,
	};

	// Return the payload as a JSON response
	return c.json(payload);
};

export const DashboardAdmin = { Get };
