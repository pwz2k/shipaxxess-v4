import { Form, FormControl, FormField, FormItem, FormMessage } from "@client/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";
import { Type } from "@shipaxxess/shipaxxess-zod-v4";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SCHEMA = z.object({
	shipping_date: z.string(),
	type: Type.ZODSCHEMA,
	type_select: z.string(),
});

type SCHEMA = z.infer<typeof SCHEMA>;

const Types = () => {
	const form = useForm<SCHEMA>({});

	return (
		<Form {...form}>
			<form>
				<div className="py-8">
					<h1 className="mb-2 text-xl font-medium">Choose a service</h1>
					<FormField
						control={form.control}
						name="type_select"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger className="h-24 [&>span]:w-full">
											<SelectValue placeholder="Choose" className="hello" />
										</SelectTrigger>
										<SelectContent className="w-full">
											<SelectItem value="1" className="w-full">
												<div className="flex items-center justify-between w-full gap-24">
													<div className="flex flex-col items-start flex-1">
														<h1 className="pr-2 text-xl font-semibold">UPS Ground</h1>
														<p className="text-muted-foreground">
															$100 insurance included • Estimated delivery Saturday 12/30 by 6:00 PM if shipped on 12/27
														</p>
													</div>
													<p className="text-2xl font-semibold">$50.70</p>
												</div>
											</SelectItem>
											<SelectItem value="2" className="w-full">
												<div className="flex items-center justify-between w-full gap-24">
													<div className="flex flex-col items-start flex-1">
														<h1 className="pr-2 text-xl font-semibold">USPS FirstClass</h1>
														<p className="text-muted-foreground">
															$100 insurance included • Estimated delivery Saturday 12/30 by 6:00 PM if shipped on 12/27
														</p>
													</div>
													<p className="text-2xl font-semibold">$50.70</p>
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
};

export default Types;
