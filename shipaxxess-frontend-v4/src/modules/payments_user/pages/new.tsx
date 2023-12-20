import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { CreditCard } from "lucide-react";
import NewPaymentForm from "../components/form";
import { Card } from "@client/components/ui/card";

const NewPaymentUserPage = () => {
	return (
		<>
			<Meta title="New Payments" />

			<div className="px-4 py-8 space-y-8">
				<Title title="New Payments" />
				<Breadcrumb
					items={[
						{ title: "Payments", link: "/payments", icon: <CreditCard size={16} /> },
						{ title: "New Payment", link: "/payments/new" },
					]}
				/>

				<Card className="p-8">
					<NewPaymentForm />
				</Card>
			</div>
		</>
	);
};

export default NewPaymentUserPage;
