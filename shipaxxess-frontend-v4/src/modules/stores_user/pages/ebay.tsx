import { api } from "@client/lib/api";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StoreEbayUserPage = () => {
	const { search } = useLocation();

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

	React.useEffect(() => {
		const code = search.match(/\?code=([^&]+)/);
		if (!code) return;

		exchangeCode(code[1]);
	});

	return <div>StoreEbayUserPage</div>;
};

export default StoreEbayUserPage;
