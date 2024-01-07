import { RouteObject } from "react-router-dom";
import BatchsAdminPage from "./pages";
import ViewBatchAdminPage from "./pages/view";

const Routes: RouteObject[] = [
	{ path: "batchs", element: <BatchsAdminPage /> },
	{ path: "batchs/view", element: <ViewBatchAdminPage /> },
];

export default Routes;
