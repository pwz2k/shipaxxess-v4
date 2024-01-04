import useQuery from "@client/hooks/useQuery";
import { api } from "@client/lib/api";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StoreEbayUserPage = () => {
	const { search } = useLocation();

	const query = useQuery();
	const navigate = useNavigate();

	const exchangeCode = async (code: string) => {
		const req = await api.url(`/user/stores/ebay/callback?code=${code}`).useAuth().get();
		const res = await req.json<{ success: boolean; id: number }>();

		if (!res.success) {
			api.showErrorToast();
			return;
		}

		api.showSuccessToast("Successfully connected to eBay!");

		navigate(`/stores/ebay?import_id=${res.id}`);
	};

	const getOders = async (id: string) => {
		const req = await api.url(`/user/stores/ebay/fetch?id=${id}`).useAuth().get();
		const res = await req.json<{ success: boolean }>();

		if (!res.success) {
			api.showErrorToast();
			return;
		}

		console.log(res);

		api.showSuccessToast("Successfully imported orders!");
	};

	React.useEffect(() => {
		const code = search.match(/\?code=([^&]+)/);
		if (code) {
			exchangeCode(code[1]);
		}

		if (query.get("import_id")) {
			getOders(query.get("import_id")!);
		}
	});

	return <div>StoreEbayUserPage</div>;
};

export default StoreEbayUserPage;
