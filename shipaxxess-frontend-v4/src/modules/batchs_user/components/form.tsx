import { Card } from "@client/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Address } from "@shipaxxess/shipaxxess-zod-v4";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";

const ShippingForm = () => {
	const form = useForm<Address.ZODSCHEMA>({
		defaultValues: {
			city: "",
			company_name: "",
			country: "",
			full_name: "default",
			state: "",
			street_one: "",
			street_two: "",
			zip: "",
		},
		resolver: zodResolver(Address.ZODSCHEMA),
	});

	return (
		<Card className="p-8">
			<Form {...form}>
				<form>
					<h1 className="mb-6 text-xl">Ship To</h1>
					<div className="grid grid-cols-2 mb-8 gap-x-8 gap-y-4">
						<FormField
							control={form.control}
							name="full_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="company_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="street_one"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Street 1</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="street_two"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Street 2</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="state"
							render={({ field }) => (
								<FormItem>
									<FormLabel>State</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<h1 className="mb-6 text-xl">Ship From</h1>
					<FormField
						control={form.control}
						name="full_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
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
				</form>
			</Form>
		</Card>
	);
};

export default ShippingForm;
