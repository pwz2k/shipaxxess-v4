import React from "react";
import "@client/styles/index.css";
import { router } from "./routes";
import ReactDOM from "react-dom/client";
import { Toaster, toast } from "sonner";
import { RouterProvider } from "react-router-dom";
import { TimezoneProvider } from "@client/contexts/timezone";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error((error as Error).message);
		},
	}),
});
// app.js or main entry file
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
		.then(registration => {
			console.log('Service Worker registered with scope:', registration.scope);
			const userId = 6;

			if (registration.active) {
				registration.active.postMessage({
					type: 'INIT_WEBSOCKET',
					userId: userId
				});
			}
		})
		.catch(error => {
			console.error('Service Worker registration failed:', error);
		});

	navigator.serviceWorker.ready.then(registration => {
		const userId = 6;
		if (registration.active) {
			registration.active.postMessage({
				type: 'INIT_WEBSOCKET',
				userId: userId
			});
		}
	});
}


ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<TimezoneProvider>
				<RouterProvider router={router} />
			</TimezoneProvider>
			<Toaster richColors />
		</QueryClientProvider>
	</React.StrictMode>,
);
