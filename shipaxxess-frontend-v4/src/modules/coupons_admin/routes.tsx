import { RouteObject } from "react-router-dom";
import TypesAdminPage from "./pages";
import NewTypeAdminPage from "./pages/new";
import EditTypeAdminPage from "./pages/edit";

const Routes: RouteObject[] = [
	{ path: "coupons", element: <TypesAdminPage /> },
	{ path: "coupons/new", element: <NewTypeAdminPage /> },
	{ path: "coupons/:id", element: <EditTypeAdminPage /> },
];

export default Routes;
