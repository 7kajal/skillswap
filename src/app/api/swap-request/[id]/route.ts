import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from "@/lib/apiResponse";
import { updateSwapRequestStatus } from "@/modules/swapRequest/swapRequest.service";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  const { id } = await params;

  try {
    const { status } = await req.json();
    const result = await updateSwapRequestStatus(id, session.user.id, status);
    return apiSuccess(result, "Status updated");
  } catch (err: any) {
    if (err.message === "Request not found") return apiNotFound(err.message);
    if (err.message === "Unauthorized") return apiUnauthorized();
    return apiError("Internal server error");
  }
}
