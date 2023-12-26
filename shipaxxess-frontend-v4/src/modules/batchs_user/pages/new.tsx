import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { Tags } from "lucide-react";
import ShippingForm from "../components/form";

const NewBatchUserPage = () => {
	return (
		<>
			<Meta title="Create a Shipping Label" />

			<div className="px-4 py-8 space-y-8">
				<Title title="Create a Shipping Label" />

				<Breadcrumb
					items={[
						{ title: "Batches", link: "/batchs", icon: <Tags size={16} /> },
						{ title: "Create a Shipping Label", link: "batchs/new_batch" },
					]}
				/>

				<ShippingForm />
			</div>
		</>
	);
};

export default NewBatchUserPage;
