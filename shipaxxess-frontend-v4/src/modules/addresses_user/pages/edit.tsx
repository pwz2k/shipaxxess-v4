import React from "react";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { MapPin } from "lucide-react";
import { Card } from "@client/components/ui/card";
import { useForm } from "react-hook-form";
import { useLoading } from "@client/hooks/useLoading";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@client/lib/api";
import { useAddressQuery } from "../hooks/useAddressQuery";
import AddressForm from "../components/form";

import { Address } from "@shipaxxess/shipaxxess-zod-v4";
import { useNavigate } from "react-router-dom";
import useQuery from "@client/hooks/useQuery";

const EditAddressPage = () => {
	const query = useQuery();
	const navigate = useNavigate();

	const addressQuery = useAddressQuery(query.get("uuid")!);

	const { button, setIsLoading } = useLoading({
		label: "Update Address",
	});

	const form = useForm<Address.ZODSCHEMA>({
		resolver: zodResolver(Address.ZODSCHEMA),
		defaultValues: {
			city: "",
			company_name: "",
			country: "United States",
			full_name: "",
			state: "NY",
			street_one: "",
			street_two: "",
			zip: "",
		},
	});

	const submit = async (values: Address.ZODSCHEMA) => {
		setIsLoading(true);

		if (!addressQuery.data) return;

		const req = await api.url("/user/addresses").patch({ ...values, id: addressQuery.data.id });
		const res = await req.json<{ success: boolean }>();

		if (res.success) {
			api.showSuccessToast();
			navigate("/addresses", { preventScrollReset: true });
			return;
		}

		api.showErrorToast();
		setIsLoading(false);
		return;
	};

	React.useEffect(() => {
		if (addressQuery.data) {
			form.setValue("city", addressQuery.data.city);
			form.setValue("company_name", addressQuery.data.company_name || "");
			form.setValue("country", addressQuery.data.country);
			form.setValue("full_name", addressQuery.data.full_name);
			form.setValue("state", addressQuery.data.state);
			form.setValue("zip", addressQuery.data.zip);
			form.setValue("street_one", addressQuery.data.street_one);
			form.setValue("street_two", addressQuery.data.street_two || "");
		}
	}, [addressQuery.data, form]);

	return (
		<>
			<Meta title="Edit Address" />

			<div className="px-4 py-8 space-y-8">
				<Title title="Edit Address" />
				<Breadcrumb
					items={[
						{ title: "Addresses", link: "/addresses", icon: <MapPin size={16} /> },
						{ title: "Edit Address", link: `/addresses/edit?uuid=${query.get("uuid")}` },
					]}
				/>
				<Card className="p-8">
					<AddressForm button={button} form={form} submit={submit} />
				</Card>
			</div>
		</>
	);
};

export default EditAddressPage;
