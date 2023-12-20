import Meta from "@client/components/common/meta";
import AuthLayout from "@client/components/layouts/auth";
import SignInFormComponent from "../components/form";
import SVGsiteLogo from "@client/components/common/logo";

const SingInUserPage = () => {
	return (
		<AuthLayout>
			<Meta title="SignUp" />

			<div className="w-full max-w-2xl p-16 mx-auto bg-white rounded-lg ring ring-primary/5">
				<div className="flex flex-col items-center mb-16">
					<SVGsiteLogo />
					<h1 className="text-2xl font-bold text-primary">Sign In</h1>
					<span className="text-base text-primary/70">Hey there, please signin to continue</span>
				</div>
				<SignInFormComponent />
			</div>
		</AuthLayout>
	);
};

export default SingInUserPage;
