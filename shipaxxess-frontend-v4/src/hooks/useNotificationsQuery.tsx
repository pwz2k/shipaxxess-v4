import { useQuery } from "@tanstack/react-query";

export const useNotificationsQuery = () => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			console.log("fetcthignnotifatio")
			return [];
		},
	});
};
