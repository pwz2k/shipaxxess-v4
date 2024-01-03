import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { Button } from "@client/components/ui/button";
import { Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { useBatchesQuery } from "../hooks/useBatchesQuery";
import useTable from "@client/hooks/useTable";
import React from "react";
import { TimezoneContext } from "@client/contexts/timezone";
import { batchColumns } from "../data/columns";
import Search from "@client/components/common/search";

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
			<Meta title="Batches" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Batches"
					render={
						<>
							<Search />
							<ToggleColumns />
							<Link to="/batchs/new">
								<Button>New Batch</Button>
							</Link>
						</>
					}
				/>

				<Breadcrumb items={[{ title: "Batches", link: "/batchs", icon: <Tags size={16} /> }]} />
				<CardTable />
			</div>
		</>
	);
};

export default BatchsUserPage;
