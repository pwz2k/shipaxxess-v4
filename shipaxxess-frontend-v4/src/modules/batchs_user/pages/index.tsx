import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { Button } from "@client/components/ui/button";
import { Tags } from "lucide-react";
import { Link } from "react-router-dom";

const BatchsUserPage = () => {
	return (
		<>
			<Meta title="Batches" />

			<div className="px-4 py-8 space-y-8">
				<Title
					title="Batches"
					render={
						<Link to="/batchs/new">
							<Button>New Batch</Button>
						</Link>
					}
				/>

				<Breadcrumb items={[{ title: "Batches", link: "/batchs", icon: <Tags size={16} /> }]} />
			</div>
		</>
	);
};

export default BatchsUserPage;
