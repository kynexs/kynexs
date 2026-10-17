import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in-form";
import { getSession } from "@/services/auth/session";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/overview");

  const params = await searchParams;
  return <SignInForm nextPath={params.next || "/overview"} />;
}
