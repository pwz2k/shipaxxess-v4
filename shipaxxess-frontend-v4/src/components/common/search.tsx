import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@client/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

const Search = () => {
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
					<DialogTitle>Search</DialogTitle>
					<div className="py-4">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(submit)}>
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Keyword</FormLabel>
												<FormControl>
													<Input placeholder="Search..." {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button>Search</Button>
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
