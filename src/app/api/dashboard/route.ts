import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { getDashboardStats } from "@/modules/dashboard/dashboard.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const stats = await getDashboardStats(session.user.id);
    return apiSuccess(stats);
  } catch {
    return apiError("Internal server error");
  }
}
