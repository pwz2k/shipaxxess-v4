import { RouteObject } from "react-router-dom";
import NewBatchUserPage from "./pages";

const Routes: RouteObject[] = [
	{
		path: "batchs/new_batch",
		element: <NewBatchUserPage />,
	},
];

export default Routes;
