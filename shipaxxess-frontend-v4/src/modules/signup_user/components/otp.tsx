import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { useLoading } from "@client/hooks/useLoading";
import { api } from "@client/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Verify } from "@shipaxxess/shipaxxess-zod-v4";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Otp = ({ query }: { query: URLSearchParams }) => {
	const navigate = useNavigate();

	const { button, setIsLoading } = useLoading({ label: "Submit & Verify", className: "w-full mt-8" });

	const form = useForm<Verify.ZODSCHEMA>({
		defaultValues: {
			type: "email_verification",
			email_address: query.get("email_address") || "",
			code: "",
		},
		resolver: zodResolver(Verify.ZODSCHEMA),
	});

	const onSubmit = async (values: Verify.ZODSCHEMA) => {
		const req = await api.url("/verify_email").post(values);
		const data = await req.json<{ success: boolean; token: string }>();

		if (data.token) {
			api.showSuccessToast();
			localStorage.setItem("token", data.token);
			navigate("/dashboard");
			return;
		}

		api.showErrorToast();
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col gap-6 py-28">
			<div>
				<h1 className="text-xl">Code sent! Check inbox/spam folder</h1>
				<p className="text-base text-muted-foreground">
					Hi, we just sent you a mail with the verification code. Please copy the code here to verify your email address
				</p>
			</div>

			<Form {...form}>
				<form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
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

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} autoComplete="on" className="hidden" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email_address"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} autoComplete="on" className="hidden" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{button}
				</form>
			</Form>
		</div>
	);
};

export default Otp;
