import { auth } from "@/lib/auth";
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest } from "@/lib/apiResponse";
import { findReview, createReview } from "@/modules/review/review.service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  const { searchParams } = new URL(req.url);
  const swapRequestId = searchParams.get("swapRequestId");
  const reviewerId = searchParams.get("reviewerId");

  if (!swapRequestId || !reviewerId) return apiBadRequest("Missing parameters");

  try {
    const review = await findReview(swapRequestId, reviewerId);
    return apiSuccess(review || {});
  } catch {
    return apiError("Internal server error");
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return apiUnauthorized();

  try {
    const { swapRequestId, reviewedId, rating, comment } = await req.json();
    const review = await createReview(swapRequestId, session.user.id, reviewedId, rating, comment);
    return apiSuccess(review, "Review submitted");
  } catch (err: any) {
    if (err.message === "Already reviewed") return apiBadRequest(err.message);
    return apiError("Internal server error");
  }
}
