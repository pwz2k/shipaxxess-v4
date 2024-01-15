import { RouteObject } from "react-router-dom";
import BatchsUserPage from "./pages";
import NewBatchUserPage from "./pages/new";
import ViewBatchUserPage from "./pages/view";

const Routes: RouteObject[] = [
	{ path: "batch", element: <BatchsUserPage /> },
	{ path: "batch/new", element: <NewBatchUserPage /> },
	{ path: "batch/:uuid", element: <ViewBatchUserPage /> },
];

export default Routes;
