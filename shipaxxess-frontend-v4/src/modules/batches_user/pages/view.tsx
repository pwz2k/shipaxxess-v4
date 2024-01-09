import useQuery from "@client/hooks/useQuery";
import { useBatchQuery } from "../hooks/useLabelsQuery";
import React from "react";
import { TimezoneContext } from "@client/contexts/timezone";
import { labelsColumns } from "../data/view";
import useTable from "@client/hooks/useTable";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { Tags } from "lucide-react";
import { Button } from "@client/components/ui/button";

const ViewBatchUserPage = () => {
	const query = useQuery();

	const batchQuery = useBatchQuery({ uuid: query.get("uuid") });

	const { timezone } = React.useContext(TimezoneContext);

	const { CardTable, ToggleColumns } = useTable({
		key: "batchs_labels",
		columns: labelsColumns(timezone),
		data: batchQuery.data,
		loading: batchQuery.isLoading,
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
							<ToggleColumns />
							<Button variant="outline">Refund</Button>
							<Button variant="outline">Download PDF</Button>
						</>
					}
				/>
				<Breadcrumb
					items={[
						{ title: "Batches", link: "/batchs", icon: <Tags size={16} /> },
						{ title: query.get("uuid")!, link: `/batchs/view?uuid=${query.get("uuid")}` },
					]}
				/>
				<CardTable />
			</div>
		</>
	);
};

export default ViewBatchUserPage;
