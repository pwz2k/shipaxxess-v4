import React from "react";
import "@client/styles/index.css";
import { router } from "./routes";
import { app } from "./config/app";
import ReactDOM from "react-dom/client";
import { Toaster, toast } from "sonner";
import { RouterProvider } from "react-router-dom";
import { TimezoneProvider } from "@client/contexts/timezone";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error((error as Error).message);
		},
	}),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<TimezoneProvider>
				<RouterProvider router={router} />
			</TimezoneProvider>
			<Toaster richColors />
			{app.mode === "dev" && <ReactQueryDevtools initialIsOpen={false} position="left" />}
		</QueryClientProvider>
	</React.StrictMode>,
);
