import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { useBatchesQuery } from "../hooks/useBatchesQuery";
import useTable from "@client/hooks/useTable";
import React from "react";
import { TimezoneContext } from "@client/contexts/timezone";
import { batchColumns } from "../data/columns";
import Search from "@client/components/common/search";
import { Tags } from "lucide-react";

const BatchsUserPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const batchesQuery = useBatchesQuery();

	const { CardTable, ToggleColumns } = useTable({
		key: "addresses",
		columns: batchColumns(timezone),
		data: batchesQuery.data,
		loading: batchesQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});

	return (
		<>
			<Meta title="Batch History" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Batch History"
					render={
						<>
							<Search />
							<ToggleColumns />
						</>
					}
				/>

				<Breadcrumb items={[{ title: "Batch History", link: "/batchs", icon: <Tags size={16} /> }]} />
				<CardTable />
			</div>
		</>
	);
};

export default BatchsUserPage;
