import { TimezoneContext } from "@client/contexts/timezone";
import React from "react";
import { usePackagesQuery } from "../hooks/usePackagesQuery";
import { packagesColumns } from "../data/columns";
import useTable from "@client/hooks/useTable";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@client/components/ui/button";
import Search from "@client/components/common/search";

const PackagesUserPage = () => {
	const { timezone } = React.useContext(TimezoneContext);

	const packagesQuery = usePackagesQuery();

	const { CardTable, ToggleColumns } = useTable({
		key: "packages",
		columns: packagesColumns(timezone),
		data: packagesQuery.data,
		loading: packagesQuery.isLoading,
		sort: [{ id: "id", desc: true }],
	});

	return (
		<>
			<Meta title="Packages" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Packages"
					render={
						<>
							<Search />
							<ToggleColumns />
							<Link to="/packages/new">
								<Button>New Package</Button>
							</Link>
						</>
					}
				/>
				<Breadcrumb items={[{ title: "Packages", link: "/packages", icon: <Boxes size={16} /> }]} />
				<CardTable />
			</div>
		</>
	);
};

export default PackagesUserPage;
