import { RouteObject } from "react-router-dom";
import TypesAdminPage from "./pages";
import NewTypeAdminPage from "./pages/new";

const Routes: RouteObject[] = [
	{ path: "types", element: <TypesAdminPage /> },
	{ path: "types/new", element: <NewTypeAdminPage /> },
];

export default Routes;
