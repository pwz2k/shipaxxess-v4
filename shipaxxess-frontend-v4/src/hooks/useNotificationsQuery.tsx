import { api } from "@client/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
export const useNotificationsQuery = () => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await api.url("/user/notifications").useAuth().get();
			const data = await res.json() as any;
			if (data.error) {
				throw new Error(data.error);
			}
			return data;



		},
	});
};

// mutation to mark notification as read

// invkae this function to mark all notifications as read
export const useMarkAsReadMutation = () => {

	// refetch the notifications query after marking all as read

	return useMutation({
		mutationKey: ["mark-as-read"],
		mutationFn: async () => {
			const res = await api.url("/user/notifications").useAuth().patch({});
			const data = await res.json() as any;
			if (data.error) {
				throw new Error(data.error);
			}
			return data;


		},


		onSuccess: () => {
			// new QueryClient().invalidateQueries({ queryKey: ["notifications"] });
		},
	});
};