import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";
import { findMatches } from "@/modules/discover/discover.service";

export async function GET() {
  const session = await auth();

  try {
    const matches = await findMatches(session?.user?.id);
    return apiSuccess(matches);
  } catch {
    return apiError("Internal server error");
  }
}
