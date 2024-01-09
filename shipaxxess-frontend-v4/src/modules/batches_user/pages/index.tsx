import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { Button } from "@client/components/ui/button";
import { Tag, Tags } from "lucide-react";
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
			<Meta title="Batch History" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Batch History"
					render={
						<>
							<Search />
							<ToggleColumns />
							<Button variant="outline" className="gap-2">
								<Tag size={16} />
								Create a Label
							</Button>
							<Link to="/batchs/new">
								<Button className="gap-2">
									<Tags size={16} /> Create New Batch
								</Button>
							</Link>
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
