import Meta from "@client/components/common/meta";
import FromComponent from "../components/form";
import { Card } from "@client/components/ui/card";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { Weight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@client/components/common/loading";
import { useTypesQuery } from "../hooks/useTypesQuery";

const NewWeightAdminPage = () => {
	const form = useForm<Weights.CREATESCHEMA>({
		defaultValues: {
			reseller_cost: 0,
			from_weight: 0,
			to_weight: 0,
			user_cost: 0,
			type_id: 0,
		},
		resolver: zodResolver(Weights.CREATESCHEMA),
	});

	const typesQuery = useTypesQuery();

	if (typesQuery.isLoading) {
		return <Loading />;
	}

	return (
		<>
			<Meta title="New Weight" />

			<div className="px-4 py-8 space-y-8">
				<Title title="New Weight" />
				<Breadcrumb
					items={[
						{ title: "Weights", link: "/admin/weights", icon: <Weight size={16} /> },
						{ title: "New Weight", link: "/admin/weights/new" },
					]}
				/>
				<Card className="p-8">
					<FromComponent form={form} query={typesQuery} />
				</Card>
			</div>
		</>
	);
};

export default NewWeightAdminPage;
