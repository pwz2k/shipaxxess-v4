import { Button } from "@client/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SCHEMA = z.object({
	code: z.string().min(6).max(6),
});

type SCHEMA = z.infer<typeof SCHEMA>;

const Otp = () => {
	const form = useForm<SCHEMA>({ defaultValues: { code: "" }, resolver: zodResolver(SCHEMA) });

	return (
		<div className="flex flex-col gap-6 py-28">
			<div>
				<h1 className="text-xl">Code sent! Check inbox/spam folder</h1>
				<p className="text-base text-muted-foreground">
					Hi, we just sent you a mail with the verification code. Please copy the code here to verify your email address
				</p>
			</div>

			<Form {...form}>
				<form className="w-full">
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Verification Code</FormLabel>
								<FormControl>
									<Input {...field} autoComplete="on" placeholder="Enter the six digit verification code here" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className="w-full mt-8">Submit & Verify</Button>
				</form>
			</Form>
		</div>
	);
};

export default Otp;
