import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/sign-up-form";
import { adminExists, getSession } from "@/services/auth/session";

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect("/overview");

  if (await adminExists()) {
    redirect("/sign-in");
  }

  return <SignUpForm />;
}
