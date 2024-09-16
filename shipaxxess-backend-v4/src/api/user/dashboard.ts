import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { and, count, desc, eq, sql, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import statesData from "../../../../shipaxxess-frontend-v4/src/data/states.json";
import { refunds } from "@schemas/refunds";
import { backupdr } from "googleapis/build/src/apis/backupdr";

const monthNames = [
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

export const Get = async (c: Context<App>) => {
	const db = drizzle(c.env.DB);
	const userId = c.get("jwtPayload").id;

	// Fetch the user information
	const user = await db.select().from(users).where(eq(users.id, userId));
	const logginUser = user[0];

	// Ensure the user exists
	if (!logginUser) {
		return c.json({ error: "User not found" }, 404);
	}

	// Fetch the number of shipments and total cost_user per state for the current user
	const topStateResultsRaw = await db
		.select({
			state: batchs.sender_state,
			totalShipments: sql`COUNT(*)`.as<number>(),
			totalCostUser: sql`SUM(${labels.cost_user})`.as<number>(), // Use `labels.cost_user` if correct
		})
		.from(batchs)
		.where(and(eq(batchs.user_id, userId), eq(batchs.status_label, "completed"))) // Ensure correct field if `user_id` is in `batchs`
		.groupBy(batchs.sender_state)
		.execute();

	const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JS

	// Fetch the number of shipments per month for the current user in the current year
	const monthlyShipmentsRaw = await db
		.select({
			month: sql`strftime('%m', ${batchs.created_at})`.as<number>(), // Extract month from created_at
			value: sql`COUNT(${batchs.id})`,
		})
		.from(batchs)
		.where(and(eq(batchs.user_id, userId), eq(batchs.status_label, "completed")))
		.groupBy(sql`strftime('%m', ${batchs.created_at})`) // Ensure correct table reference
		.orderBy(desc(sql`strftime('%m', ${batchs.created_at})`)) // Order by month
		.execute();

	// Create an array to represent all months with shipments
	const monthlyShipments = monthNames.map((month, index) => {
		// Find if there are shipments for this month (1-indexed)
		const shipment = monthlyShipmentsRaw.find((item) => Number(item.month) === index + 1);

		// Set upcoming months (greater than current month) to 0
		if (index + 1 > currentMonth) {
			return { month, value: 0 };
		}

		return {
			month,
			value: shipment ? shipment.value : 0,
		};
	});

	const totalShipments = topStateResultsRaw.reduce((acc, result) => acc + result.totalShipments, 0);

	const topStateResults = topStateResultsRaw.map((result) => {
		const stateFullName = statesData.find((item) => item.id === result.state)?.name || result.state;
		const averageCostUser = result.totalShipments ? (result.totalCostUser / result.totalShipments).toFixed(2) : "0.00";
		const percentage = totalShipments ? ((result.totalShipments / totalShipments) * 100).toFixed(2) : "0.00";

		return {
			name: stateFullName,
			shipments: result.totalShipments,
			average: averageCostUser,
			percentage: `${percentage}%`,
		};
	});

	// Fetch transaction history for the current user
	const transcationHistory = await db
		.select({
			transactionId: payments.id,
			amount: payments.credit,
			balance: payments.current_balance,
			status: payments.status,
			date: payments.created_at,
			type: payments.gateway,
		})
		.from(payments)
		.where(eq(payments.user_id, userId));

	const pendingRefund = await db
		.select({
			totalLabel: count(batchs.id),
			amount: sum(batchs.cost_user),
		})
		.from(batchs)

		.where(and(eq(batchs.user_id, userId), eq(batchs.status_label, "pending_refund")));

	const avgLabelCost = await db
		.select({
			month: sql`strftime('%m', ${payments.created_at})`.as<number>(), // Extract month from created_at
			value: sql`SUM(${payments.credit})`.as<number>(),
			count: sql`COUNT(${payments.id})`.as<number>(),
		})
		.from(payments)
		.groupBy(sql`strftime('%m', ${payments.created_at})`)
		.orderBy(desc(sql`strftime('%m', ${payments.created_at})`))
		.where(and(eq(payments.user_id, userId), eq(payments.gateway, "Label"), eq(payments.status, "confirmed")))
		.execute();

	const monthlyAvgLabelCost = monthNames.map((month, index) => {
		// Find if there are shipments for this month (1-indexed)
		const cost = avgLabelCost.find((item) => Number(item.month) === index + 1);

		// Set upcoming months (greater than current month) to 0
		if (index + 1 > currentMonth) {
			return { month, value: 0 };
		}

		return {
			label: month,
			value: cost ? (cost.value / cost.count) : 0,
		};
	});

	// Construct the payload
	const payload = {
		staticsCard: {
			currnetBalance: logginUser.current_balance,
			totalSpend: logginUser.total_spent,
			totalRefund: logginUser.total_refund,
			referlBalance: logginUser.credit_for_refer_from_user,
			totalShipingCost: 0, // Calculate as needed
			carrierAdjustment: 0, // Calculate as needed
			pendingRefund: {
				total: pendingRefund[0].totalLabel,
				amount: pendingRefund[0].amount,
			}, // Calculate as needed
			avgDomesticShippingCost: 0, // Calculate as needed
			avgInternationalShippingCost: 0, // Calculate as needed
			newShipment: 0, // Calculate as needed
			deliveryIssues: 0, // Calculate as needed
		},
		totalPayment: 0, // Calculate as needed
		averageCost: monthlyAvgLabelCost, // Calculate as needed
		totalShipment: totalShipments,
		serivces: 0, // Calculate as needed
		recipentZones: 0, // Calculate as needed
		topstates: topStateResults,
		topInternatonal: {
			country: "",
			shipment: 0,
		},
		transcationHistory: transcationHistory,
		monthlyShipments,
	};

	return c.json(payload);
};

export const DashboardUser = { Get };
