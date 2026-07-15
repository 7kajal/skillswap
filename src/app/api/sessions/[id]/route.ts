import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { updateSessionStatus } from "@/modules/sessions/session.service";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  const { id } = await params;

  try {
    const { status } = await req.json();
    const updated = await updateSessionStatus(id, session.user.id, status);
    return apiSuccess(updated, "Session updated");
  } catch (err: any) {
    if (err.message === "Session not found") return apiError(err.message, 404);
    if (err.message === "Unauthorized") return apiUnauthorized();
    return apiError("Internal server error");
  }
}
