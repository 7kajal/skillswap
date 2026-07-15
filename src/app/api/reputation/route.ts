import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized } from "@/lib/apiResponse";
import { getReputation, updateSocialLinks, verifySkill } from "@/modules/reputation/reputation.service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || session.user.id;

  try {
    const reputation = await getReputation(userId);
    return apiSuccess(reputation);
  } catch {
    return apiError("Internal server error");
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const body = await req.json();
    if (body.action === "updateLinks") {
      await updateSocialLinks(session.user.id, body.links);
      return apiSuccess({ success: true }, "Links updated");
    }
    if (body.action === "verifySkill") {
      const skills = await verifySkill(session.user.id, body.skillName);
      return apiSuccess({ verifiedSkills: skills }, "Skill verified");
    }
    return apiError("Invalid action");
  } catch {
    return apiError("Internal server error");
  }
}
