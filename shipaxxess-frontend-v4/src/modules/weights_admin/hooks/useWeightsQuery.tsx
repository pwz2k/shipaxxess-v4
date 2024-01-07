import { api } from "@client/lib/api";
import { AddressesSelectModel } from "@db/addresses";
import { useQuery } from "@tanstack/react-query";

export const useWeightsQuery = () => {
	return useQuery({
		queryKey: ["admin", "weights"],
		queryFn: async () => {
			const req = await api.url("/admin/weights").useAuth().get();
			return await req.json<AddressesSelectModel[]>();
		},
	});
};
