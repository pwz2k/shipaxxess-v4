import Meta from "@client/components/common/meta";
import AuthLayout from "@client/components/layouts/auth";
import { app } from "@client/config/app";
import React from "react";
import SignUpFormComponent from "../components/form";
import SVGsiteLogo from "@client/components/common/logo";
import Otp from "../components/otp";

const SignUpUserPage = () => {
	const [showInboxView, setInboxView] = React.useState<boolean>(false);
	const [email, setEmail] = React.useState<string | null>(null);

	return (
		<AuthLayout>
			<Meta title={`Sign Up  - ${app.name}`} />

			<div className="w-full max-w-2xl p-16 mx-auto bg-white rounded-lg ring ring-primary/5">
				{!showInboxView && (
					<>
						<div className="flex flex-col items-center mb-16">
							<SVGsiteLogo />
							<h1 className="text-2xl font-bold text-primary">Sign Up</h1>
							<span className="text-base text-primary/70">Hey there, please signin to continue</span>
						</div>
						<SignUpFormComponent setInboxView={setInboxView} setEmail={setEmail} />
					</>
				)}

				{showInboxView && <Otp email={email} />}
			</div>
		</AuthLayout>
	);
};

export default SignUpUserPage;
