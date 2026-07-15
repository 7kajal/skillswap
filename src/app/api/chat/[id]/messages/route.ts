import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { isRoomMember, getMessages, sendMessage } from "@/modules/chat/chat.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  const { id } = await params;

  const member = await isRoomMember(id, session.user.id);
  if (!member) return apiUnauthorized("Not a room member");

  try {
    const messages = await getMessages(id);
    return apiSuccess(messages);
  } catch {
    return apiError("Internal server error");
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  const { id } = await params;

  const member = await isRoomMember(id, session.user.id);
  if (!member) return apiUnauthorized("Not a room member");

  try {
    const { content, fileUrl } = await req.json();
    const message = await sendMessage(id, session.user.id, content, fileUrl);
    return apiSuccess(message, "Message sent");
  } catch {
    return apiError("Internal server error");
  }
}
