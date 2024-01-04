import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	Form,
} from "@client/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";
import { useForm } from "react-hook-form";
import { Input } from "@client/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabsContent } from "@client/components/ui/tabs";
import { Separator } from "@client/components/ui/separator";
import { ScrollArea } from "@client/components/ui/scroll-area";
import { toast } from "sonner";
import { UsersSelectModel } from "@db/users";
import { useLoading } from "@client/hooks/useLoading";
import timezones from "@client/data/timezones.json";
import { User } from "@shipaxxess/shipaxxess-zod-v4";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import Loading from "@client/components/common/loading";

const SettingsProfileTab = ({ query }: { query: UseQueryResult<UsersSelectModel> }) => {
	const { button, setIsLoading } = useLoading({ label: "Update Profile" });

	const form = useForm<User.ZODSCHEMA>({
		resolver: zodResolver(User.ZODSCHEMA),
		defaultValues: {
			first_name: "",
			last_name: "",
			email_address: "",
			password: "",
		},
	});

	const submit = async (values: User.ZODSCHEMA) => {
		setIsLoading(true);
		console.log(values);
		setIsLoading(false);
		toast.success("Profile updated");
	};

	React.useEffect(() => {
		if (query.data) {
			form.setValue("first_name", query.data.first_name);
			form.setValue("last_name", query.data.last_name);
			form.setValue("email_address", query.data.email_address);
			form.setValue("timezone", query.data.timezone || "US/Eastern");
		}
	}, [form, query.data]);

	if (query.isLoading) {
		return <Loading />;
	}

	return (
		<TabsContent value="profile" className="space-y-8">
			<div className="w-full">
				<h1 className="text-2xl font-semibold text-primary">Profile</h1>
				<span className="text-base text-muted-foreground">
					You can change or update your profile information from here
				</span>
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)}>
					<div className="flex items-center gap-4 mb-4">
						<div className="w-2/4 space-y-2">
							<FormField
								control={form.control}
								name="first_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-2/4 space-y-2">
							<FormField
								control={form.control}
								name="last_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="mb-4 space-y-2">
						<FormField
							control={form.control}
							name="email_address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email address</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="mb-4 space-y-2">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} type="password" />
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="mb-4 space-y-2">
						<FormField
							control={form.control}
							name="timezone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Timezone</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select your timezone" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<ScrollArea className="h-72">
												{timezones.map((t, index) => {
													return (
														<SelectItem key={index} value={t.timezone}>
															{t.name}
														</SelectItem>
													);
												})}
											</ScrollArea>
										</SelectContent>
									</Select>
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

export default SettingsProfileTab;
