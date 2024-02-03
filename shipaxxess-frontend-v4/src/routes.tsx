import AddressRoutes from "@client/modules/addresses_user/routes";
import SignupRoutes from "@client/modules/signup_user/routes";
import SigninRoutes from "@client/modules/signin_user/routes";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "./components/layouts/user";
import DashboardRoutes from "@client/modules/dashboard_user/routes";
import PackagesRoutes from "@client/modules/packages_user/routes";
import PaymentsRoutes from "@client/modules/payments_user/routes";
import ReferralsRoutes from "@client/modules/referrals_user/routes";
import SettingsRoutes from "@client/modules/settings_user/routes";
import TickersRoutes from "@client/modules/tickets_user/routes";
import StoresRoutes from "@client/modules/stores_user/routes";
import BatchsRoutes from "@client/modules/batches_user/routes";
import LandingRoutes from "@client/modules/landing_page/routes";
import AdminLayout from "./components/layouts/admin";

import SettingsAdminRoutes from "@client/modules/settings_admin/routes";
import CronsAdminRoutes from "@client/modules/crons_admin/routes";
import UsersAdminRoutes from "@client/modules/users_admin/routes";
import TicketsAdminRoutes from "@client/modules/tickets_admin/routes";
import PaymentsAdminRoutes from "@client/modules/payments_admin/routes";
import WeightsAdminRoutes from "@client/modules/weights_admin/routes";
import TypesAdminRoutes from "@client/modules/types_admin/routes";
import BatchsAdminRoutes from "@client/modules/batches_admin/routes";
import RefundAdminRoutes from "@client/modules/refunds_admin/routes";

export const router = createBrowserRouter([
	...LandingRoutes,
	...SignupRoutes,
	...SigninRoutes,
	{
		path: "/*",
		element: <UserLayout />,
		children: [
			...AddressRoutes,
			...DashboardRoutes,
			...PackagesRoutes,
			...PaymentsRoutes,
			...ReferralsRoutes,
			...SettingsRoutes,
			...TickersRoutes,
			...StoresRoutes,
			...BatchsRoutes,
		],
	},
	{
		path: "/admin/*",
		element: <AdminLayout />,
		children: [
			...SettingsAdminRoutes,
			...CronsAdminRoutes,
			...UsersAdminRoutes,
			...TicketsAdminRoutes,
			...PaymentsAdminRoutes,
			...WeightsAdminRoutes,
			...TypesAdminRoutes,
			...BatchsAdminRoutes,
			...RefundAdminRoutes,
		],
	},
]);
