import Meta from "@client/components/common/meta";
import AuthLayout from "@client/components/layouts/auth";
import { app } from "@client/config/app";
import React from "react";
import SignUpFormComponent from "../components/form";
import SVGsiteLogo from "@client/components/common/logo";

const SignUpUserPage = () => {
	// States
	const [showInboxView, setInboxView] = React.useState<boolean>(false);

	return (
		<AuthLayout>
			<Meta title={`Sign Up  - ${app.name}`} />

			<div className="max-w-2xl mx-auto p-16 w-full bg-white ring ring-primary/5 rounded-lg">
				{!showInboxView && (
					<>
						<div className="mb-16 flex items-center flex-col">
							<SVGsiteLogo />
							<h1 className="text-primary text-2xl font-bold">Sign Up</h1>
							<span className="text-primary/70 text-base">Hey there, please signin to continue</span>
						</div>
						<SignUpFormComponent setInboxView={setInboxView} />
					</>
				)}

				{showInboxView && (
					<>
						<div className="flex flex-col gap-6 items-center justify-center py-28">
							<img src="/svg/mail-sent.svg" alt="Icon" height={140} width={140} />
							<h1 className="text-xl">Check your email for a link to verify your email address.</h1>
						</div>
					</>
				)}
			</div>
		</AuthLayout>
	);
};

export default SignUpUserPage;
