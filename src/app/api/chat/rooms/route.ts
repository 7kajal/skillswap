import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { getUserRooms } from "@/modules/chat/chat.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const rooms = await getUserRooms(session.user.id);
    return apiSuccess(rooms);
  } catch {
    return apiError("Internal server error");
  }
}
