import { api } from "@client/lib/api";
import { useQuery } from "@tanstack/react-query";
import { UsersSelectModel } from "@db/users";

export const useStatusQuery = (url: string) => {
	// Query
	const statusQuery = useQuery({
		retry: 0,
		queryKey: ["status"],
		queryFn: async () => {
			api.useAuth();

			const req = await api.url(url).get();
			const res = await req.json<UsersSelectModel>();

			if (!res.id) {
				api.showErrorToast();
			}

			return res;
		},
	});

	return statusQuery;
};
