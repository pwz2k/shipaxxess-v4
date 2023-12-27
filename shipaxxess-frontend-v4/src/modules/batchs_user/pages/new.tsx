import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { PlusCircle, Tags } from "lucide-react";
import ShippingForm from "../components/form";
import { Card } from "@client/components/ui/card";
import { Button } from "@client/components/ui/button";
import Types from "../components/types";

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

				<Card className="p-8">
					{/* <ShippingForm /> */}
					<div className="mb-8">
						<h1 className="text-xl font-semibold">Sakib Hasan</h1>
						<p className="text-base">Street 1</p>
						<p className="text-base">City, State, Country</p>
					</div>

					<div>
						<Button variant="secondary" className="mb-2">
							<PlusCircle className="pr-1" />
							Shipment Details
						</Button>
						<div className="grid grid-cols-3 gap-20 p-4 border rounded-lg bg-primary/5">
							<div>
								<h1 className="text-base font-semibold">Ship From Address: City</h1>
								<p className="text-sm">Sakib Hasan</p>
								<p className="text-sm">Street 1</p>
								<p className="text-sm">City, State, Country</p>
							</div>
							<div>
								<h1 className="text-base font-semibold">Package Details: Earbuds</h1>
								<p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
									Package Type: Envelope, Padded Envelope, Poly Bag, Soft Pack, or Box in a Bag
								</p>
								<p className="text-sm">Dimensions: 8x3"</p>
								<p className="text-sm">Weight: 4 oz</p>
							</div>
							<div>
								<h1 className="text-base font-semibold">Label Details</h1>
								<p className="text-sm">Label Size: 4x6"</p>
								<p className="text-sm">Label Filetype: PDF1</p>
							</div>
						</div>

						<Types />
					</div>
				</Card>
			</div>
		</>
	);
};

export default NewBatchUserPage;
