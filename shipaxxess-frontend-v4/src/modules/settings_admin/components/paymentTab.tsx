import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	Form,
} from "@client/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@client/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabsContent } from "@client/components/ui/tabs";
import { Separator } from "@client/components/ui/separator";
import { AdminSettingsSelectModel } from "@db/adminSettings";
import { useLoading } from "@client/hooks/useLoading";
import { Settings } from "@shipaxxess/shipaxxess-zod-v4";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import Loading from "@client/components/common/loading";
import { api } from "@client/lib/api";

const SettingsPaymentTab = ({ query }: { query: UseQueryResult<AdminSettingsSelectModel[]> }) => {
	const { button, setIsLoading } = useLoading({ label: "Update Payment Configuration" });

	const form = useForm<Settings.PAYMENTTAB>({
		resolver: zodResolver(Settings.PROFILETAB),
		defaultValues: {
			stripe_key: "",
			stripe_secret: "",
			cashapp_email: "",
			coinbase_key: "",
			coinbase_webhook_secret: "",
			stripe_webhook_secret: "",
			venmo_email: "",
			zelle_email: "",
		},
	});

	const submit = async (values: Settings.PAYMENTTAB) => {
		setIsLoading(true);

		const req = await api.url("/user/settings/profile").useAuth().post(values);
		const res = await req.json<{ success: boolean }>();

		if (!res.success) {
			api.showErrorToast();
			setIsLoading(false);
			return;
		}

		api.showSuccessToast();

		setIsLoading(false);
	};

	React.useEffect(() => {
		if (query.data) {
			const stripe = query.data.find((item) => item.setting_id === "stripe_key");
			if (stripe) {
				form.setValue("stripe_key", stripe.setting_value);
				form.setValue("stripe_secret", stripe.setting_value);
			}

			const coinbase = query.data.find((item) => item.setting_id === "coinbase_key");
			if (coinbase) {
				form.setValue("coinbase_key", coinbase.setting_value);
			}

			const venmo = query.data.find((item) => item.setting_id === "venmo_email");
			if (venmo) {
				form.setValue("venmo_email", venmo.setting_value);
			}

			const cashapp = query.data.find((item) => item.setting_id === "cashapp_email");
			if (cashapp) {
				form.setValue("cashapp_email", cashapp.setting_value);
			}

			const zelle = query.data.find((item) => item.setting_id === "zelle_email");
			if (zelle) {
				form.setValue("zelle_email", zelle.setting_value);
			}
		}
	}, [form, query.data]);

	if (query.isLoading) {
		return <Loading />;
	}

	return (
		<TabsContent value="payment_configuration" className="space-y-8">
			<div className="w-full">
				<h1 className="text-2xl font-semibold text-primary">Payment Configuration</h1>
				<span className="text-base text-muted-foreground">
					You can change or update your payment keys information from here
				</span>
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)}>
					<div className="flex flex-col gap-4 mb-4">
						<FormField
							control={form.control}
							name="stripe_key"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Stripe key</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stripe_secret"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Stripe secret</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stripe_webhook_secret"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Stripe webhook secret</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="coinbase_key"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Coinbase key</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="coinbase_webhook_secret"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Coinbase webhook secret</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="venmo_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Venmo email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cashapp_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cashapp email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="zelle_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Zelle email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex items-center gap-4">{button}</div>
				</form>
			</Form>
		</TabsContent>
	);
};

export default SettingsPaymentTab;
