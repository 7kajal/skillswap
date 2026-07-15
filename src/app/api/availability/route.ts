import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { getUserAvailability, setUserAvailability } from "@/modules/sessions/session.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const availability = await getUserAvailability(session.user.id);
    return apiSuccess(availability);
  } catch {
    return apiError("Internal server error");
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const { slots } = await req.json();
    const updated = await setUserAvailability(session.user.id, slots || []);
    return apiSuccess(updated, "Availability updated");
  } catch {
    return apiError("Internal server error");
  }
}
