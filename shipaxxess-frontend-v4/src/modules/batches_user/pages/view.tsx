import { useBatchQuery } from "../hooks/useLabelsQuery";
import React from "react";
import { TimezoneContext } from "@client/contexts/timezone";
import { labelsColumns } from "../data/view";
import useTable from "@client/hooks/useTable";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { BadgeDollarSign, FileDown, Tags } from "lucide-react";
import { Button } from "@client/components/ui/button";
import { useParams } from "react-router-dom";
import Loading from "@client/components/common/loading";

const ViewBatchUserPage = () => {
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

	if (batchQuery.isLoading) {
		return <Loading />;
	}

	return (
		<>
			<Meta title="Labels" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Labels Hisory"
					render={
						<>
							<ToggleColumns />
							<Button variant="outline" className="gap-1" disabled>
								<BadgeDollarSign size={16} />
								Batch Refund
							</Button>
							<Button variant="outline" className="gap-1" disabled>
								<FileDown size={16} />
								Batch Download
							</Button>
						</>
					}
				/>
				<Breadcrumb
					items={[
						{ title: "Batch History", link: "/batches", icon: <Tags size={16} /> },
						{ title: params.uuid!, link: `/batchs/view?uuid=${params.uuid}` },
					]}
				/>
				<CardTable />
			</div>
		</>
	);
};

export default ViewBatchUserPage;
