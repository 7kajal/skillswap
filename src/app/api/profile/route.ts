import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from "@/lib/apiResponse";
import { getProfile } from "@/modules/profile/profile.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const profile = await getProfile(session.user.id);
    if (!profile) return apiNotFound("User not found");
    return apiSuccess(profile);
  } catch {
    return apiError("Internal server error");
  }
}
