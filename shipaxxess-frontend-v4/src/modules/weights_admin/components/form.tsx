import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@client/components/ui/select";
import { Weights } from "@shipaxxess/shipaxxess-zod-v4";
import { UseFormReturn } from "react-hook-form";
import { UseQueryResult } from "@tanstack/react-query";
import { TypesSelectModel } from "@db/types";
import { useEffect } from "react";

const FromComponent = ({
	form,
	query,
	button,
	submit,
}: {
	form: UseFormReturn<Weights.CREATESCHEMA>;
	query: UseQueryResult<TypesSelectModel[]>;
	button: React.JSX.Element;
	submit: (values: Weights.CREATESCHEMA) => void;
}) => {
	useEffect(() => {
		console.log("form")
		const cost = ((form.getValues().height_percent / 100) * form.getValues().height) + ((form.getValues().width_percent / 100) * form.getValues().width) + ((form.getValues().length_percent / 100) * form.getValues().length);
		form.setValue('user_cost', cost.toFixed(2))
	}, [
		form.watch().height_percent,
		form.watch().length_percent,
		form.watch().width_percent,
		form.watch().height,
		form.watch().width,
		form.watch().length,
	])

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(submit)} className="space-y-4">
				<FormField
					control={form.control}
					name="type_id"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Delivery Type</FormLabel>
								<Select
									value={field.value || ""} // Ensure the value is controlled by form
									onValueChange={(value) => {
										field.onChange(value);  // Update form state when value changes
									}}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Choose a delivery type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{query.data?.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{query.data?.map((nod) => {
											return (
												<SelectItem key={nod.id} value={nod.id.toString()}>
													{nod.label}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="weight"
					render={({ field }) => (
						<FormItem className="">
							<FormLabel>Weight</FormLabel>
							<FormControl>
								<Input {...field} type="number" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-3">

					<FormField
						control={form.control}
						name="width"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Width (inch)</FormLabel>
								<FormControl>
									<Input {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="width_percent"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Percentage</FormLabel>
								<FormControl>
									<Input {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex gap-3">

					<FormField
						control={form.control}
						name="height"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Height (inch)</FormLabel>
								<FormControl>
									<Input {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="height_percent"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Percentage</FormLabel>
								<FormControl>
									<Input {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex gap-3">

					<FormField
						control={form.control}
						name="length"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Length (inch)</FormLabel>
								<FormControl>
									<Input {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="length_percent"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Percentage</FormLabel>
								<FormControl>
									<Input {...field} type="number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>


				<FormField
					control={form.control}
					name="reseller_cost"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Host Cost</FormLabel>
							<FormControl>
								<Input {...field} type="number" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="user_cost"
					render={({ field }) => (
						<FormItem>
							<FormLabel>User Cost</FormLabel>
							<FormControl>
								<Input {...field} type="number" disabled />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{button}
			</form>
		</Form>
	);
};

export default FromComponent;
