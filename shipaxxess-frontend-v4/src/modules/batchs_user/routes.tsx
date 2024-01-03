import { RouteObject } from "react-router-dom";
import BatchsUserPage from "./pages";
import NewBatchUserPage from "./pages/new";
import ViewBatchUserPage from "./pages/view";

const Routes: RouteObject[] = [
	{ path: "batchs", element: <BatchsUserPage /> },
	{ path: "batchs/new", element: <NewBatchUserPage /> },
	{ path: "batchs/view", element: <ViewBatchUserPage /> },
];

export default Routes;
