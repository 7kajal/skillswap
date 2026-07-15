import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { findMatches } from "@/modules/discover/discover.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const matches = await findMatches(session.user.id);
    return apiSuccess(matches);
  } catch {
    return apiError("Internal server error");
  }
}
