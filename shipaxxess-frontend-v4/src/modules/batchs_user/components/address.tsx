import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { UseFormReturn } from "react-hook-form";

export const RecipientForm = ({ form }: { form: UseFormReturn<Labels.SIMPLEZODSCHEMA> }) => {
	return (
		<>
			<FormField
				control={form.control}
				name="recipient.full_name"
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
				name="recipient.company_name"
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
				name="recipient.street_one"
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
				name="recipient.street_two"
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
				name="recipient.city"
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
				name="recipient.state"
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
				name="recipient.country"
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
		</>
	);
};

export const SenderForm = ({ form }: { form: UseFormReturn<Labels.SIMPLEZODSCHEMA> }) => {
	return (
		<>
			<FormField
				control={form.control}
				name="sender.full_name"
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
				name="sender.company_name"
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
				name="sender.street_one"
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
				name="sender.street_two"
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
				name="sender.city"
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
				name="sender.state"
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
				name="sender.country"
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
		</>
	);
};
