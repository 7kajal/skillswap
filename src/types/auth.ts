export type AuthStatus = "authenticated" | "loading" | "unauthenticated";

export interface ContinuePageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}
