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
import BatchsRoutes from "@client/modules/batchs_user/routes";

export const router = createBrowserRouter([
	...SignupRoutes,
	...SigninRoutes,
	{
		path: "/",
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
]);
