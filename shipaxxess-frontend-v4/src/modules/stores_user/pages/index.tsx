import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { TimezoneContext } from "@client/contexts/timezone";
import { Store } from "lucide-react";
import React from "react";
import { useStoresQuery } from "../hooks/useStoresQuery";
import useTable from "@client/hooks/useTable";
import { storesColumns } from "../data/columns";

const StoresUserPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const storesQuery = useStoresQuery();

	const { CardTable, ToggleColumns } = useTable({
		key: "stores",
		columns: storesColumns(timezone),
		data: storesQuery.data,
		loading: storesQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});

	return (
		<>
			<Meta title="Stores" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Stores"
					render={
						<>
							<ToggleColumns />
						</>
					}
				/>
				<Breadcrumb items={[{ title: "Stores", link: "/stores", icon: <Store size={16} /> }]} />
				<CardTable />
			</div>
		</>
	);
};

export default StoresUserPage;
