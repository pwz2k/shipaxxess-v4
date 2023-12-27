import { Form, FormControl, FormField, FormItem, FormMessage } from "@client/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";
import { Button } from "@client/components/ui/button";
import { RecipientForm } from "./address";

const ShippingForm = () => {
	const form = useForm<Labels.SIMPLEZODSCHEMA>({
		defaultValues: {
			recipient: {
				city: "",
				company_name: "",
				country: "",
				full_name: "",
				state: "",
				street_one: "",
				street_two: "",
				zip: "",
			},
			sender: {
				city: "",
				company_name: "",
				country: "",
				full_name: "",
				state: "",
				street_one: "",
				street_two: "",
				zip: "",
			},
			sender_select: "",
			package: {
				weight: 0,
				length: 0,
				width: 0,
				height: 0,
			},
		},
		resolver: zodResolver(Labels.SIMPLEZODSCHEMA),
	});

	return (
		<Form {...form}>
			<form>
				{/* RECIPIENT */}
				<div className="w-full">
					<h1 className="mb-6 text-xl">Ship To</h1>
					<div className="grid grid-cols-2 mb-8 gap-x-8 gap-y-2">
						<RecipientForm form={form} />
					</div>
				</div>

				<div className="grid grid-cols-2 gap-x-8">
					{/* SENDER */}
					<div className="w-full">
						<h1 className="mb-2 text-xl ">Ship From</h1>
						<FormField
							control={form.control}
							name="sender_select"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choose" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="default">
													<p className="text-left">Sakib Hasan</p>
													<p className="text-muted-foreground">Delete This, 516 Sose Farm Road, 90001, NY, USA</p>
												</SelectItem>
												<SelectItem value="none">
													<p className="text-left">Don't use saved Ship From address</p>
													<p className="text-muted-foreground">Create new Ship From address</p>
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{form.watch("sender_select") === "none" && (
							<div className="grid grid-cols-2 p-4 mb-8 border rounded-lg gap-x-8 gap-y-4 bg-primary/5">
								<RecipientForm form={form} />
							</div>
						)}
					</div>

					{/* PACKAGE */}
					<div className="w-full">
						<h1 className="mb-2 text-xl ">Package Details</h1>
						<FormField
							control={form.control}
							name="package_select"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choose" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="default">
													<p className="text-left">Sakib Hasan</p>
													<p className="text-muted-foreground">Delete This, 516 Sose Farm Road, 90001, NY, USA</p>
												</SelectItem>
												<SelectItem value="1">
													<p className="text-left">Don't use saved Ship From address</p>
													<p className="text-muted-foreground">Create new Ship From address</p>
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex items-center justify-end">
					<Button className="mt-8">Get Rates</Button>
				</div>
			</form>
		</Form>
	);
};

export default ShippingForm;
