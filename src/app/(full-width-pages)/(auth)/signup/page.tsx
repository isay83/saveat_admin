import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | saveat",
  description: "This is SignUp Page saveat Dashboard",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
