import { auth } from "@/lib/auth";
import AuthClientPage from "./auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  // Check if the user is already authenticated and redirect if so
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <AuthClientPage />;
}
