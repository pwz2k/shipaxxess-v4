import { TimezoneContext } from "@client/contexts/timezone";
import React from "react";
import useTable from "@client/hooks/useTable";
import { typesColumns } from "../data/columns";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { Link } from "react-router-dom";
import { Button } from "@client/components/ui/button";
import Breadcrumb from "@client/components/common/breadcrumb";
import { BadgePercent } from "lucide-react";
import { useCouponsQuery } from "../hooks/useTypesQuery";

const TypesAdminPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const couponsQuery = useCouponsQuery();

	const { CardTable, ToggleColumns } = useTable({
		key: "admin_coupons",
		columns: typesColumns(timezone),
		data: couponsQuery.data,
		loading: couponsQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});

	return (
		<>
			<Meta title="Coupons" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Coupons"
					render={
						<>
							<ToggleColumns />
							<Link to="/admin/coupons/new">
								<Button>New Coupon</Button>
							</Link>
						</>
					}
				/>
				<Breadcrumb items={[{ title: "Coupons", link: "/admin/coupons", icon: <BadgePercent size={16} /> }]} />
				<CardTable />
			</div>
		</>
	);
};

export default TypesAdminPage;
