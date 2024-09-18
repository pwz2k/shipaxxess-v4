import Breadcrumb from "@client/components/common/breadcrumb";
import Meta from "@client/components/common/meta";
import Title from "@client/components/common/title";
import { Card } from "@client/components/ui/card";
import { Coupon } from "@shipaxxess/shipaxxess-zod-v4";
import { Type as IconType } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLoading } from "@client/hooks/useLoading";
import { api } from "@client/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CouponForm } from "../components/form";

const NewTypeAdminPage = () => {
	const form = useForm<Coupon.CREATESCHEMA>({
		defaultValues: {
			code: "",
			value: 0,
			usedCount: 0,
		},
		resolver: zodResolver(Coupon.CREATESCHEMA),
	});

	const navigate = useNavigate();

	const { button, setIsLoading } = useLoading({ label: "Submit" });

	const submit = async (values: Coupon.CREATESCHEMA) => {
		console.log(values)
		setIsLoading(true);

		const req = await api.url("/admin/coupons").useAuth().post(values);
		const res = await req.json<{ success: boolean }>();

		if (res.success) {
			form.reset();
			setIsLoading(false);
			api.showSuccessToast("Coupon created successfully");
			navigate("/admin/coupons");
			return;
		}

		setIsLoading(false);
		api.showErrorToast();
	};

	return (
		<>
			<Meta title="New Coupons" />

			<div className="px-4 py-8 space-y-8">
				<Title title="New Coupon" />
				<Breadcrumb
					items={[
						{ title: "Coupons", link: "/admin/coupons", icon: <IconType size={16} /> },
						{ title: "New Coupon", link: "/admin/coupons/new" },
					]}
				/>

				<Card className="p-8">
					<CouponForm form={form} submit={submit} button={button} />
				</Card>
			</div>
		</>
	);
};

export default NewTypeAdminPage;
