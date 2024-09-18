import { api } from "@client/lib/api";
import { CouponsSelectModel } from "@db/coupons";
import { useQuery } from "@tanstack/react-query";

export const useCouponQuery = (id: number) => {
	return useQuery({
		queryKey: ["admin", "coupons", id],
		queryFn: async () => {
			const req = await api.url(`/admin/coupons/${id}`).useAuth().get();
			return await req.json<CouponsSelectModel>();
		},
	});
};
