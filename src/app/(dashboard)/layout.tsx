import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <header className="flex h-16 items-center justify-end gap-4 p-4">
        <Suspense fallback={null}>
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <button
                type="button"
                className="h-10 cursor-pointer rounded-full bg-purple-700 px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base"
              >
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </Suspense>
      </header>

      {children}
    </ClerkProvider>
  );
}
