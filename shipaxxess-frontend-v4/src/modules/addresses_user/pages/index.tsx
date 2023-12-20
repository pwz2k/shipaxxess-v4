import Meta from "@client/components/common/meta";
import React from "react";
import { addressesColumns } from "../data/columns";
import useTable from "@client/hooks/useTable";
import { TimezoneContext } from "@client/contexts/timezone";
import { useAddressesQuery } from "../hooks/useAddressesQuery";
import Title from "@client/components/common/title";
import { Button } from "@client/components/ui/button";
import Breadcrumb from "@client/components/common/breadcrumb";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Search from "@client/components/common/search";

const AddressesUserPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const addressesQuery = useAddressesQuery();

	const { CardTable, ToggleColumns } = useTable({
		key: "addresses",
		columns: addressesColumns(timezone),
		data: addressesQuery.data,
		loading: addressesQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});

	return (
		<>
			<Meta title="Addresses" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Addresses"
					render={
						<>
							<Search />
							<ToggleColumns />
							<Link to="/addresses/new">
								<Button>New Address</Button>
							</Link>
						</>
					}
				/>
				<Breadcrumb items={[{ title: "Addresses", link: "/addresses", icon: <MapPin size={16} /> }]} />
				<CardTable />
			</div>
		</>
	);
};

export default AddressesUserPage;
