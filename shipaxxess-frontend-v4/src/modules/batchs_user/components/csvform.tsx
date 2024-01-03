import { DialogWrapperWithForm } from "@client/components/common/dialog";
import { Button } from "@client/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/components/ui/select";
import { Address } from "@shipaxxess/shipaxxess-zod-v4";
import { UseFormReturn } from "react-hook-form";

type CSVFormProps = {
	dialog: boolean;
	setDialog: React.Dispatch<React.SetStateAction<boolean>>;
	form: UseFormReturn<Address.ZODSCHEMA>;
	headers: string[];
	setHeaders: React.Dispatch<React.SetStateAction<string[]>>;
	onsubmit: (values: Address.ZODSCHEMA) => void;
};

const CSVForm = ({ dialog, form, setDialog, headers, onsubmit }: CSVFormProps) => {
	return (
		<DialogWrapperWithForm
			form={form}
			open={dialog}
			setOpen={setDialog}
			title="Assign CSV Fields"
			confirm={<Button type="submit">Import</Button>}
			onsubmit={onsubmit}>
			<>
				<FormField
					control={form.control}
					name="full_name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for name" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
					name="company_name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>
									Campany/Reference <span className="text-xs text-muted-foreground">(optional)</span>
								</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for company/reference" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
					name="street_one"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Street 1</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for street 1" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
					name="street_two"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>
									Street 2 <span className="text-xs text-muted-foreground">(optional)</span>
								</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for street 2" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
					name="city"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>City</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for city" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
					name="state"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>State</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for state" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
					name="zip"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Zip</FormLabel>
								<Select defaultValue={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Assign field for zip" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{headers.length === 0 && (
											<SelectItem value="0" disabled>
												Not found
											</SelectItem>
										)}
										{headers.map((header, index) => {
											return (
												<SelectItem key={index} value={header}>
													{header}
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
			</>
		</DialogWrapperWithForm>
	);
};

export default CSVForm;
