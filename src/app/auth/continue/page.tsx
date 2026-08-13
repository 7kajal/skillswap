import { findUserById } from "@/app/api/auth/service";
import { auth } from "@/lib/auth";
import type { ContinuePageProps } from "@/types/auth";
import { redirect } from "next/navigation";

function safeRedirect(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") && !value.startsWith("/auth")
    ? value
    : "/discover";
}

export default async function ContinuePage({
  searchParams,
}: ContinuePageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await findUserById(session.user.id);
  if (!user?.isProfileComplete) redirect("/profile/complete");

  const { redirectTo } = await searchParams;
  redirect(safeRedirect(redirectTo));
}
