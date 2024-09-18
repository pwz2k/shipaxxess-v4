import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { Coupon } from "@shipaxxess/shipaxxess-zod-v4";
import React from "react";
import { UseFormReturn } from "react-hook-form";



export const CouponForm = ({
	form,
	submit,
	button,
}: {
	form: UseFormReturn<Coupon.ZODSCHEMA>;
	submit: (value: Coupon.ZODSCHEMA) => void;
	button: React.JSX.Element;
}) => {

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(submit)} className="space-y-4">
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="value"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Value (percent)</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									{...field}
									onChange={(e) => field.onChange(parseFloat(e.target.value))} // Ensure value is a number
								/>
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
