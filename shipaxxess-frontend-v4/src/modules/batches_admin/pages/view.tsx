import { useBatchQuery } from "../hooks/useBatchQuery";
import React from "react";
import { TimezoneContext } from "@client/contexts/timezone";
import { labelsColumns } from "../data/labels";
import useTable from "@client/hooks/useTable";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { BadgeDollarSign, Tags } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@client/components/ui/button";

const ViewBatchAdminPage = () => {
	const params = useParams();

	const batchQuery = useBatchQuery({ uuid: params.uuid! });

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
			<Meta title="Batch History" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Batch History"
					render={
						<>
							<ToggleColumns />
							<Button variant="outline" disabled className="gap-1">
								<Tags size={16} />
								Batch Download
							</Button>
							<Button variant="outline" disabled className="gap-1">
								<BadgeDollarSign size={16} /> Batch Refund
							</Button>
						</>
					}
				/>
				<Breadcrumb
					items={[
						{ title: "Batch History", link: "/admin/batches", icon: <Tags size={16} /> },
						{ title: params.uuid!, link: `/admin/batches/${params.uuid!}` },
					]}
				/>
				<CardTable />
			</div>
		</>
	);
};

export default ViewBatchAdminPage;
