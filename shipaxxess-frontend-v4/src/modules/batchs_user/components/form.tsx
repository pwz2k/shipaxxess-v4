import Loading from "@client/components/common/loading";
import { DatePicker } from "@client/components/common/picker";
import { Button, buttonVariants } from "@client/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@client/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";
import { Separator } from "@client/components/ui/separator";
import { app } from "@client/config/app";
import { numberWithCommas } from "@client/lib/utils";
import { AddressesSelectModel } from "@db/addresses";
import { PackagesSelectModel } from "@db/packages";
import { TypesSelectModel } from "@db/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Labels } from "@shipaxxess/shipaxxess-zod-v4";
import { UseQueryResult } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import { StateCombobox } from "@client/components/common/combobox";

type BatchNewFormProps = {
	addresses: UseQueryResult<AddressesSelectModel[]>;
	packages: UseQueryResult<PackagesSelectModel[]>;
	types: UseQueryResult<TypesSelectModel[]>;
};

type onPlaceSelectedProps = {
	address_components: {
		types: string;
		long_name: string;
		short_name: string;
	}[];
};

const BatchNewForm = ({ addresses, packages, types }: BatchNewFormProps) => {
	const form = useForm<Labels.BATCHZODSCHEMA>({
		defaultValues: {
			shippingdate: new Date().toISOString(),
			sender_select: "default",
		},
		resolver: zodResolver(Labels.BATCHZODSCHEMA),
	});

	if (addresses.isLoading || packages.isLoading || types.isLoading) {
		return <Loading />;
	}

	const onSubmit = (data: Labels.BATCHZODSCHEMA) => {
		console.log(data);
	};

	const onCSVSubmit = () => {};

	const onPlaceSelected = (place: onPlaceSelectedProps) => {
		place.address_components.map((components) => {
			switch (components.types[0]) {
				case "route":
					form.setValue(
						"recipient.0.street_one",
						`${form.getValues("recipient.0.street_one")} ${components.long_name}`,
					);
					break;
				case "street_number":
					form.setValue("recipient.0.street_one", components.long_name);
					break;
				case "locality":
					form.setValue("recipient.0.city", components.long_name);
					break;
				case "administrative_area_level_1":
					form.setValue("recipient.0.state", components.short_name);
					break;
				case "postal_code":
					form.setValue("recipient.0.zip", components.long_name);
					break;
				case "country":
					form.setValue("recipient.0.country", components.long_name);
					break;
				case "postal_code_suffix":
					form.setValue("recipient.0.zip", `${form.getValues("recipient.0.zip")}-${components.long_name}`);
					break;
				default:
					break;
			}
		});
	};

	console.log(form.formState.errors);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>New Label</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-3 grid-rows-1 gap-6">
							<FormField
								control={form.control}
								name="type_select"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Delivery Type</FormLabel>
											<Select defaultValue={field.value} onValueChange={field.onChange}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Choose a delivery type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{types.data?.length === 0 && (
														<SelectItem value="not_found" disabled>
															Not found
														</SelectItem>
													)}
													{types.data?.map((nod) => {
														return (
															<SelectItem key={nod.id} value={nod.uuid}>
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
								name="shippingdate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Shipping Date</FormLabel>
										<FormControl>
											<DatePicker field={field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="sender_select"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Sender</FormLabel>
											<Select defaultValue={field.value} onValueChange={field.onChange}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Choose a sender" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{addresses.data?.length === 0 && (
														<SelectItem value="not_found" disabled>
															Not found
														</SelectItem>
													)}
													{addresses.data?.map((nod) => {
														return (
															<SelectItem key={nod.id} value={nod.default ? "default" : nod.uuid}>
																{`${nod.full_name}, ${nod.street_one}, ${nod.city}, ${nod.zip}, ${nod.state}`}
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
						</div>
						<div className="grid grid-cols-5 grid-rows-1 gap-6">
							<FormField
								control={form.control}
								name="package_select"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Package</FormLabel>
											<Select
												defaultValue={field.value}
												onValueChange={field.onChange}
												disabled={form.watch("type.id") ? false : true}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Choose a package" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{packages.data?.length === 0 && (
														<SelectItem value="not_found" disabled>
															Not found
														</SelectItem>
													)}
													{packages.data?.map((nod) => {
														return (
															<SelectItem key={nod.id} value={nod.uuid}>
																{nod.name}
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
								name="package.weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Weight ({form.watch("type.unit")})</FormLabel>
										<FormControl>
											<Input {...field} type="number" disabled={form.watch("type.id") ? false : true} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="package.height"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Height (inch)</FormLabel>
										<FormControl>
											<Input {...field} type="number" disabled={form.watch("type.id") ? false : true} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="package.width"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Width (inch)</FormLabel>
										<FormControl>
											<Input {...field} type="number" disabled={form.watch("type.id") ? false : true} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="package.length"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Length (inch)</FormLabel>
										<FormControl>
											<Input {...field} type="number" disabled={form.watch("type.id") ? false : true} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
				</Card>

				<div className="flex items-center justify-center p-4 my-8 border border-dashed rounded-lg shadow">
					<div className="flex items-center gap-6">
						<Input type="file" id="file" className="hidden" onChange={onCSVSubmit} />
						<Label
							className={buttonVariants({
								variant: "outline",
								className: "cursor-pointer",
							})}
							htmlFor="file">
							Import from CSV
						</Label>
						<span>--OR--</span>
						<Link to="/stores">
							<Button variant="outline">Import From Store</Button>
						</Link>
					</div>
				</div>

				<div className="flex w-full gap-8">
					<Card className="w-4/6 p-4 ">
						<h1 className="mb-4">New Recipent</h1>
						<div className="grid grid-cols-2 grid-rows-4 mb-4 gap-x-6 gap-y-2">
							<FormField
								control={form.control}
								name="recipient.0.full_name"
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
								name="recipient.0.company_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Company Name <span>(optional)</span>
										</FormLabel>
										<FormControl>
											<Input {...field} autoComplete="on" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="recipient.0.street_one"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Street 1</FormLabel>
										<FormControl>
											<Autocomplete
												placeholder=""
												className="border border-[#d9d9d9] border-solid w-full h-10  rounded-lg px-4"
												options={{
													componentRestrictions: { country: ["us"] },
													fields: ["address_components", "geometry"],
													types: ["address"],
												}}
												apiKey={app.mapapi}
												onPlaceSelected={(place) => onPlaceSelected(place)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="recipient.0.street_two"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Street 2 <span>(optional)</span>
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="recipient.0.city"
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
								name="recipient.0.zip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Zip</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="mt-2.5">
								<StateCombobox form={form} name="recipient.0.state" />
							</div>
							<FormField
								control={form.control}
								name="recipient.0.country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="United States">United States</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</Card>
					<div className="w-2/6">
						<Card className="p-6 space-y-2">
							<div className="grid items-center grid-cols-2">
								<h1 className="text-sm text-left text-muted-foreground">Single Label Cost:</h1>
								<p className="text-lg font-normal text-right">${0.0}</p>
							</div>
							<div className="grid items-center grid-cols-2">
								<h1 className="text-sm text-left text-muted-foreground">Total Recipents :</h1>
								<p className="text-lg font-normal text-right">{0}</p>
							</div>
							<div className="grid items-center grid-cols-2">
								<h1 className="text-sm text-left text-muted-foreground">Coupon :</h1>
								<p className="text-lg font-normal text-right text-green-500">- ${10}</p>
							</div>
							<Separator />
							<div className="grid items-center grid-cols-2">
								<h1 className="text-sm text-left text-muted-foreground">You will pay in total :</h1>
								<p className="text-3xl font-semibold text-right text-primary">${numberWithCommas(10)}</p>
							</div>
							<div className="flex items-center justify-end pt-4">
								<Button type="submit" className="w-full">
									Confirm & Pay
								</Button>
							</div>
						</Card>
						<div className="py-4 mt-4 bg-white rounded-lg shadow">
							<p className="px-4 text-xs text-justify text-muted-foreground">
								Note: You are responsible for all variable and transactional costs of using the service (including but
								not limited to: postage, fees for carrier services, package insurance, items purchased in the online
								store, direct and indirect costs of third-party service providers and carriers, transaction fees charged
								directly by {app.name} for shipping or other services, or other special services selected, such as
								on-demand consulting, order fulfillment and technical support) in addition to your applicable service
								fee
							</p>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default BatchNewForm;
