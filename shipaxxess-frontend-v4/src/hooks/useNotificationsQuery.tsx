import { api } from "@client/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useNotificationsQuery = () => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const req = await api.url("/user/notifications").useAuth().get();
			const data = await req.json()
			console.log("Data", data)

			return data
		},
	});
};
