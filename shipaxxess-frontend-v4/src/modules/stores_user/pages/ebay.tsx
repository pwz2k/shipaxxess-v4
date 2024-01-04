import useQuery from "@client/hooks/useQuery";
import { api } from "@client/lib/api";
import React from "react";

const StoreEbayUserPage = () => {
	const query = useQuery();

	const exchangeCode = async (code: string) => {
		const req = await api.url(`/user/stores/ebay/callback?code=${code}`).useAuth().get();
		const res = await req.json<{ success: boolean; id: number }>();

		if (!res.success) {
			api.showErrorToast();
			return;
		}

		api.showSuccessToast("Successfully connected to eBay!");

		const req1 = await api.url(`/user/stores/ebay/fetch?id=${res.id}`).useAuth().get();
		const res1 = await req1.json<{ success: boolean }>();

		if (!res1.success) {
			api.showErrorToast();
			return;
		}

		console.log(res1);
	};

	React.useEffect(() => {
		if (query.get("code")) {
			exchangeCode(query.get("code")!);
		}
	}, [query]);

	return <div>StoreEbayUserPage</div>;
};

export default StoreEbayUserPage;
