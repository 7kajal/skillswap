import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest } from "@/lib/apiResponse";
import { createSession, getSessionsForUser } from "@/modules/sessions/session.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const sessions = await getSessionsForUser(session.user.id);
    return apiSuccess(sessions);
  } catch {
    return apiError("Internal server error");
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const body = await req.json();
    const { swapRequestId, title, description, date, startTime, endTime, timezone, meetLink } = body;

    if (!swapRequestId || !title || !date || !startTime || !endTime) {
      return apiBadRequest("Missing required fields: swapRequestId, title, date, startTime, endTime");
    }

    const newSession = await createSession(session.user.id, {
      swapRequestId,
      title,
      description,
      date,
      startTime,
      endTime,
      timezone,
      meetLink,
    });

    return apiSuccess(newSession, "Session scheduled");
  } catch (err: any) {
    if (err.message === "Swap request not found") return apiBadRequest(err.message);
    if (err.message === "Swap request must be accepted") return apiBadRequest(err.message);
    if (err.message === "Unauthorized") return apiUnauthorized();
    return apiError("Internal server error");
  }
}
