import { api } from "@client/lib/api";
import { TypesSelectModel } from "@db/types";
import { useQuery } from "@tanstack/react-query";

export const useCouponsQuery = () => {
	return useQuery({
		queryKey: ["admin", "coupons"],
		queryFn: async () => {
			const req = await api.url("/admin/coupons").useAuth().get();
			return await req.json<TypesSelectModel[]>();
		},
	});
};
