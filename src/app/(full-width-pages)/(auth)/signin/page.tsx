import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | saveat",
  description: "This is Signin Page saveat Admin Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
