import { RouteObject } from "react-router-dom";
import BatchsUserPage from "./pages";
import NewBatchUserPage from "./pages/new";
import ViewBatchUserPage from "./pages/view";

const Routes: RouteObject[] = [
	{ path: "batches", element: <BatchsUserPage /> },
	{ path: "batches/new", element: <NewBatchUserPage /> },
	{ path: "batches/view", element: <ViewBatchUserPage /> },
];

export default Routes;
