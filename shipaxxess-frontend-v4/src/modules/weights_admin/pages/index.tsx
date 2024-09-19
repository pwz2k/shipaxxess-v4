import { TimezoneContext } from "@client/contexts/timezone";
import React, { useEffect, useState } from "react";
import { useWeightsQuery } from "../hooks/useWeightsQuery";
import useTable from "@client/hooks/useTable";
import { weightsColumns } from "../data/columns";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { Weight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@client/components/ui/button";
import { api } from "@client/lib/api";
import { useDiscountQuery } from "../hooks/useWeightQuery";

const WeightsAdminPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const weightsQuery = useWeightsQuery();
	const discountsQuery = useDiscountQuery();
	const { CardTable, ToggleColumns } = useTable({
		key: "admin_weights",
		columns: weightsColumns(timezone),
		data: weightsQuery.data,
		loading: weightsQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});
	const [discount, setDiscount] = React.useState(0)
	useEffect(() => {
		setDiscount(discountsQuery?.data?.[0]?.value || 0)
	}, [discountsQuery.data])

	const submit = async () => {

		const req = await api.url("/admin/discounts").post({
			value: discount
		});
		const res = await req.json<{ success: true }>();

		if (res.success) {
			api.showSuccessToast("Discount updated successfully");
			return;
		}

		api.showErrorToast();
	};
	return (
		<>
			<Meta title="Weights" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Weights"
					render={
						<>
							<ToggleColumns />
							<Link to="/admin/weights/new">
								<Button>New Weight</Button>
							</Link>
						</>
					}
				/>
				<Breadcrumb items={[{ title: "Weights", link: "/admin/weights", icon: <Weight size={16} /> }]} />
				<div className="flex items-end gap-1">
					<div className="flex flex-col">
						<label className="font-medium">Discount (percentage)</label>
						<input value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value))} type="number" className="border-2 rounded-md focus:outline-none font-semibold p-1.5 w-max">
						</input>
					</div>
					<Button onClick={submit}>Save</Button>
				</div>
				<CardTable />
			</div>
		</>
	);
};

export default WeightsAdminPage;
