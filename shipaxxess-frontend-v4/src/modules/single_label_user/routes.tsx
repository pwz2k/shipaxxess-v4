import { RouteObject } from "react-router-dom";
import SignleLabelUserPage from "./pages";

const Routes: RouteObject[] = [
	{
		path: "/single_label",
		element: <SignleLabelUserPage />,
	},
];

export default Routes;
