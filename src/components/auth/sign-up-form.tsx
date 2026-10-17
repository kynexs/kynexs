"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { claimFirstAdmin } from "@/action/auth/actions";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setBusy(true);

    const claim = await claimFirstAdmin();
    if (!claim.ok) {
      setBusy(false);
      toast.error(claim.error);
      router.push("/sign-in");
      return;
    }

    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setBusy(false);
      toast.error(error.message ?? "Could not create account");
      return;
    }

    const promote = await claimFirstAdmin(email);
    setBusy(false);
    if (!promote.ok) {
      toast.error(promote.error);
      return;
    }

    toast.success("Admin account created");
    router.push("/overview");
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-xl border border-border bg-surface-100 p-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
          Create admin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          One-time setup. After this, new users are created from the dashboard.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            className="h-11 bg-surface-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 bg-surface-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="h-11 bg-surface-200"
          />
        </div>
        <Button type="submit" className="h-11 w-full" disabled={busy}>
          {busy ? "Creating…" : "Create admin account"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-lime hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
