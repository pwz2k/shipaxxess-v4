import { useStatusQuery } from "@client/hooks/useStatusQuery";
import React from "react";
import { useReferralsQuery } from "../hooks/useReferrals";
import useTable from "@client/hooks/useTable";
import { referralsColumns } from "../data/columns";
import { TimezoneContext } from "@client/contexts/timezone";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Search from "@client/components/common/search";
import { Alert, AlertDescription, AlertTitle } from "@client/components/ui/alert";
import { Share2 } from "lucide-react";
import { Button } from "@client/components/ui/button";
import { toast } from "sonner";
import { app } from "@client/config/app";

const ReferralsUserPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const statusQuery = useStatusQuery("/user/status");
	const referralsQuery = useReferralsQuery();

	const { CardTable, ToggleColumns } = useTable({
		key: "referrals",
		columns: referralsColumns(timezone),
		data: referralsQuery.data,
		loading: referralsQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});

	const copyLink = () => {
		if (!statusQuery.data) return;

		const link = `${app.mode === "dev" ? app.host : app.prod_host}/signup?ref=${statusQuery.data.uuid}`;

		navigator.clipboard.writeText(link);
		toast.success(`Copied: ${link}`);
	};

	return (
		<>
			<Meta title="Referrals" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Referrals"
					render={
						<>
							<Search />
							<ToggleColumns />
						</>
					}
				/>

				<Alert>
					<Share2 className="w-4 h-4" />
					<AlertTitle>Referral Bonus!</AlertTitle>
					<AlertDescription>
						<div className="flex items-center justify-between">
							<span>You will get 10% from every referral you made</span>
							<Button onClick={copyLink}>Copy Your Referral Link (click)</Button>
						</div>
					</AlertDescription>
				</Alert>

				<CardTable />
			</div>
		</>
	);
};

export default ReferralsUserPage;
