import { RouteObject } from "react-router-dom";
import WeightsAdminPage from "./pages";
import NewWeightAdminPage from "./pages/new";

const Routes: RouteObject[] = [
	{ path: "weights", element: <WeightsAdminPage /> },
	{ path: "weights/new", element: <NewWeightAdminPage /> },
];

export default Routes;
