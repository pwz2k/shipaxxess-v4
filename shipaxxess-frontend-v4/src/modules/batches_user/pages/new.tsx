import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { useTypesQuery } from "@client/hooks/useTypes";
import { useAddressesQuery } from "@client/modules/addresses_user/hooks/useAddressesQuery";
import { usePackagesQuery } from "@client/modules/packages_user/hooks/usePackagesQuery";
import { Tags } from "lucide-react";
import BatchNewForm from "../components/form";

const NewBatchUserPage = () => {
	const addressesQuery = useAddressesQuery();
	const packagesQuery = usePackagesQuery();
	const typesQuery = useTypesQuery();

	return (
		<>
			<Meta title="Create a New Batch Label" />

			<div className="px-4 py-8 space-y-8">
				<Title title="Create a New Batch Label" />

				<Breadcrumb
					items={[
						{ title: "Batch History", link: "/batchs", icon: <Tags size={16} /> },
						{ title: "Create a New Batch Label", link: "batchs/new_batch" },
					]}
				/>

				<BatchNewForm addresses={addressesQuery} packages={packagesQuery} types={typesQuery} />
			</div>
		</>
	);
};

export default NewBatchUserPage;
