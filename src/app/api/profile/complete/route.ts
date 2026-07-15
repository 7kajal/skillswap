import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { completeProfile } from "@/modules/profile/profile.service";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const body = await req.json();
    await completeProfile(session.user.id, body);
    return apiSuccess({ success: true }, "Profile completed");
  } catch {
    return apiError("Internal server error");
  }
}
