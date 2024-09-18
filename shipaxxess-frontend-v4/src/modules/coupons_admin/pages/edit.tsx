import Loading from "@client/components/common/loading";
import { useForm } from "react-hook-form";
import { Coupon } from "@shipaxxess/shipaxxess-zod-v4";
import { useLoading } from "@client/hooks/useLoading";
import { api } from "@client/lib/api";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import Breadcrumb from "@client/components/common/breadcrumb";
import { Card } from "@client/components/ui/card";
import { Type as IconType } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCouponQuery } from "../hooks/useCouponQuery";
import { CouponForm } from "../components/form";

const EditTypeAdminPage = () => {
	const params = useParams();

	const navigate = useNavigate();
	const couponQuery = useCouponQuery(params.id!);

	const form = useForm<Coupon.ZODSCHEMA>({
		defaultValues: {
			code: "",
			value: 0,
			usedCount: 0,
		},
		resolver: zodResolver(Coupon.ZODSCHEMA),
	});

	const { button, setIsLoading } = useLoading({ label: "Submit" });

	const submit = async (values: Coupon.ZODSCHEMA) => {
		if (!couponQuery.data) return;

		setIsLoading(true);

		const req = await api
			.url("/admin/coupons")
			.useAuth()
			.patch({ ...values, id: couponQuery.data.id });
		const res = await req.json<{ success: boolean }>();

		if (res.success) {
			setIsLoading(false);
			api.showSuccessToast("Coupon updated successfully");
			navigate("/admin/coupons");
			return;
		}

		setIsLoading(false);
		api.showErrorToast();
	};

	React.useEffect(() => {
		if (couponQuery.data) {
			form.setValue("value", couponQuery.data.value);
			form.setValue("code", couponQuery.data.code);
		}
	}, [form, couponQuery.data]);

	if (couponQuery.isLoading) {
		return <Loading />;
	}

	return (
		<>
			<Meta title="Edit Types" />

			<div className="px-4 py-8 space-y-8">
				<Title title="Edit Types" />
				<Breadcrumb
					items={[
						{ title: "Types", link: "/admin/types", icon: <IconType size={16} /> },
						{ title: "Edit Type", link: `/admin/types/edit?uuid=${params.uuid!}` },
					]}
				/>

				<Card className="p-8">
					<CouponForm form={form} submit={submit} button={button} />
				</Card>
			</div>
		</>
	);
};

export default EditTypeAdminPage;
