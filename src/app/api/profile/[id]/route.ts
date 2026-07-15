import { apiSuccess, apiError, apiNotFound } from "@/lib/apiResponse";
import { getProfileById } from "@/modules/profile/profile.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const profile = await getProfileById(id);
    if (!profile) return apiNotFound("User not found");
    return apiSuccess(profile);
  } catch {
    return apiError("Internal server error");
  }
}
