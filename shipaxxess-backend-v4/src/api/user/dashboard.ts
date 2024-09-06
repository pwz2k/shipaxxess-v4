import { batchs } from "@schemas/batchs";
import { labels } from "@schemas/labels";
import { payments } from "@schemas/payments";
import { users } from "@schemas/users";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import statesData from '../../../../shipaxxess-frontend-v4/src/data/states.json';

const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const Get = async (c: Context<App>) => {
	const db = drizzle(c.env.DB);
	const userId = c.get("jwtPayload").id;

	// Fetch the user information
	const user = await db.select().from(users).where(eq(users.id, userId));
	const logginUser = user[0];

	// Ensure the user exists
	if (!logginUser) {
		return c.json({ error: 'User not found' }, 404);
	}

	// Fetch the number of shipments and total cost_user per state for the current user
	const topStateResultsRaw = await db
		.select({
			state: batchs.sender_state,
			totalShipments: sql`COUNT(*)`.as<number>(),
			totalCostUser: sql`SUM(${labels.cost_user})`.as<number>(), // Use `labels.cost_user` if correct
		})
		.from(batchs)
		.where(eq(batchs.user_id, userId)) // Ensure correct field if `user_id` is in `batchs`
		.groupBy(batchs.sender_state)
		.execute();

	const totalShipments = topStateResultsRaw.reduce((acc, result) => acc + result.totalShipments, 0);
	const currentYear = new Date().getFullYear();
	const topStateResults = topStateResultsRaw.map(result => {
		const stateFullName = statesData.find(item => item.id === result.state)?.name || result.state;
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
	const transcationHistory = await db.select({
		transactionId: payments.id,
		amount: payments.credit,
		balance: payments.current_balance,
		status: payments.status,
		date: payments.created_at,
		type: payments.gateway,
	}).from(payments).where(eq(payments.user_id, userId));

	// Construct the payload
	const payload = {
		staticsCard: {
			currnetBalance: logginUser.current_balance,
			totalSpend: logginUser.total_spent,
			totalRefund: logginUser.total_refund,
			referlBalance: logginUser.credit_for_refer_from_user,
			totalShipingCost: 0, // Calculate as needed
			carrierAdjustment: 0, // Calculate as needed
			pendingRefund: 0, // Calculate as needed
			avgDomesticShippingCost: 0, // Calculate as needed
			avgInternationalShippingCost: 0, // Calculate as needed
			newShipment: 0, // Calculate as needed
			deliveryIssues: 0, // Calculate as needed
		},
		totalPayment: 0, // Calculate as needed
		avergeCost: 0, // Calculate as needed
		totalShipment: 0, // Calculate as needed
		serivces: 0, // Calculate as needed
		recipentZones: 0, // Calculate as needed
		topstates: topStateResults,
		topInternatonal: {
			country: "",
			shipment: 0,
		},
		transcationHistory: transcationHistory,
	};

	return c.json(payload);
};

export const DashboardUser = { Get };
