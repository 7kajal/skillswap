import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest, apiConflict } from "@/lib/apiResponse";
import { getSentRequests, getReceivedRequests, createSwapRequest } from "@/modules/swapRequest/swapRequest.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const [sent, received] = await Promise.all([
      getSentRequests(session.user.id),
      getReceivedRequests(session.user.id),
    ]);
    return apiSuccess({ sent, received });
  } catch {
    return apiError("Internal server error");
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const { receiverId, teachSkillName, learnSkillName, message } = await req.json();
    const result = await createSwapRequest(session.user.id, {
      receiverId,
      teachSkillName,
      learnSkillName,
      message,
    });
    return apiSuccess(result, "Swap request sent");
  } catch (err: any) {
    if (err.message === "Cannot send request to yourself") return apiBadRequest(err.message);
    if (err.message === "A request already exists with this person") return apiConflict(err.message);
    return apiError("Internal server error");
  }
}
