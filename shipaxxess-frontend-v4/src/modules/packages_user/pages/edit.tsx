import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import { useLoading } from "@client/hooks/useLoading";
import { api } from "@client/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "@shipaxxess/shipaxxess-zod-v4";
import { Boxes } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PackageForm from "../components/form";
import { Card } from "@client/components/ui/card";
import Title from "@client/components/common/title";
import React from "react";
import { usePackageQuery } from "../hooks/usePackageQuery";
import useQuery from "@client/hooks/useQuery";

const EditPackageUserPage = () => {
	const query = useQuery();
	const navigate = useNavigate();

	const packageQuery = usePackageQuery(query.get("uuid"));

	const { button, setIsLoading } = useLoading({
		label: "Update Package",
	});

	const form = useForm<Package.ZODSCHEMA>({
		resolver: zodResolver(Package.ZODSCHEMA),
		defaultValues: {
			height: 0,
			length: 0,
			name: "",
			weight: 0,
			width: 0,
		},
	});

	const submit = async (values: Package.ZODSCHEMA) => {
		setIsLoading(true);

		if (!packageQuery.data) return;

		const req = await api.url("/user/packages").patch({ ...values, id: packageQuery.data.id });
		const res = await req.json<{ success: boolean }>();

		if (res.success) {
			api.showSuccessToast();
			navigate("/packages");
			return;
		}

		api.showErrorToast();
		setIsLoading(false);
	};

	React.useEffect(() => {
		if (packageQuery.data) {
			form.setValue("height", packageQuery.data.height);
			form.setValue("length", packageQuery.data.length);
			form.setValue("name", packageQuery.data.name);
			form.setValue("weight", packageQuery.data.weight);
			form.setValue("width", packageQuery.data.width);
		}
	}, [packageQuery.data, form]);

	return (
		<>
			<Meta title="Edit Package" />

			<div className="px-4 py-8 space-y-8">
				<Title title="Edit Package" />
				<Breadcrumb
					items={[
						{ title: "Packages", link: "/packages", icon: <Boxes size={16} /> },
						{ title: "Edit Package", link: `/packages/edit?uuid=${query.get("uuid")}` },
					]}
				/>
				<Card className="p-8">
					<PackageForm button={button} form={form} submit={submit} />
				</Card>
			</div>
		</>
	);
};

export default EditPackageUserPage;
