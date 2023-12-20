import { Hono } from "hono";
import { ForgetPassword } from "./forget";
import { SignInUser } from "./signin";
import { SignUpUser } from "./signup";
import { VerifyUser } from "./verify";

const unprotected = new Hono<App>();

unprotected.post("/signup_user", SignUpUser);
unprotected.post("/signin_user", SignInUser);
unprotected.get("/forget_password", ForgetPassword);
unprotected.post("/verify", VerifyUser);

export { unprotected };
