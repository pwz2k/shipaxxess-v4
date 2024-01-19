import { CalendarIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@client/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { UseQueryResult } from "@tanstack/react-query";
import { TypesSelectModel } from "@db/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { cn } from "@client/lib/utils";

const Search = ({ type, typesQuery }: { type?: string | null; typesQuery?: UseQueryResult<TypesSelectModel[]> }) => {
	const form = useForm();

	const submit = async () => {};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon" variant="outline">
					<SearchIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Search By</DialogTitle>
					<div className="py-4">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(submit)}>
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="uuid_query"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													UUID <span className="text-xs text-muted-foreground">(Label/Batch)</span>
												</FormLabel>
												<FormControl>
													<Input placeholder="375ef169-ec23-445f-9c6e-3f580cc4fcbc" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{type === "order_history" && (
										<>
											<FormField
												control={form.control}
												name="name_query"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Name <span className="text-xs text-muted-foreground">(From/To/Batch/Package)</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Search by name..." {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="weight_query"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Weight</FormLabel>
														<FormControl>
															<Input placeholder="Search by weight..." {...field} type="number" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											{typesQuery && (
												<FormField
													control={form.control}
													name="type_query"
													render={({ field }) => {
														return (
															<FormItem>
																<FormLabel>Delivery Type</FormLabel>
																<Select
																	defaultValue={field.value}
																	onValueChange={(value) => {
																		field.onChange(value);
																	}}>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Search by type" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{typesQuery.data?.length === 0 && (
																			<SelectItem value="0" disabled>
																				Not found
																			</SelectItem>
																		)}
																		{typesQuery.data?.map((nod) => {
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
											)}

											<FormField
												control={form.control}
												name="status_query"
												render={({ field }) => {
													return (
														<FormItem>
															<FormLabel>Status</FormLabel>
															<Select defaultValue={field.value} onValueChange={field.onChange}>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Search by status" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value="inqueue">In Queue</SelectItem>
																	<SelectItem value="processing">Processing</SelectItem>
																	<SelectItem value="awaiting">Awaiting</SelectItem>
																	<SelectItem value="inprogress">In Progress</SelectItem>
																	<SelectItem value="delivered">Delivered</SelectItem>
																	<SelectItem value="completed">Complete</SelectItem>
																	<SelectItem value="cancelled">Cancelled</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													);
												}}
											/>
											<FormField
												control={form.control}
												name="from_date_query"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel>From Date</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"pl-3 text-left font-normal",
																			!field.value && "text-muted-foreground",
																		)}>
																		{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
																		<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent className="w-full p-0" align="start">
																<Calendar
																	mode="single"
																	selected={field.value}
																	onSelect={field.onChange}
																	disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
																	initialFocus
																/>
															</PopoverContent>
														</Popover>

														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="to_date_query"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel>To Date</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={"outline"}
																		className={cn(
																			"pl-3 text-left font-normal",
																			!field.value && "text-muted-foreground",
																		)}>
																		{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
																		<CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent className="w-full p-0" align="start">
																<Calendar
																	mode="single"
																	selected={field.value}
																	onSelect={field.onChange}
																	disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
																	initialFocus
																/>
															</PopoverContent>
														</Popover>

														<FormMessage />
													</FormItem>
												)}
											/>
										</>
									)}

									<Button className="w-full" disabled>
										Submit
									</Button>
								</div>
							</form>
						</Form>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default Search;
