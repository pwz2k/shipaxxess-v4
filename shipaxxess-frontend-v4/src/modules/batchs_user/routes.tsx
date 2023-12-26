import { RouteObject } from "react-router-dom";
import BatchsUserPage from "./pages";
import NewBatchUserPage from "./pages/new";

const Routes: RouteObject[] = [
	{ path: "batchs", element: <BatchsUserPage /> },
	{ path: "batchs/new", element: <NewBatchUserPage /> },
];

export default Routes;
