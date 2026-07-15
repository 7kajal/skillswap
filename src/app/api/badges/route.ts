import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { getAndAwardBadges } from "@/modules/badges/badges.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const badges = await getAndAwardBadges(session.user.id);
    return apiSuccess(badges);
  } catch {
    return apiError("Internal server error");
  }
}
