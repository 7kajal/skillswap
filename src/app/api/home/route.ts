import { getHomeData } from "./service";
import { apiError, apiSuccess } from "@/lib/apiResponse";

export async function GET() {
  try {
    return apiSuccess(await getHomeData());
  } catch {
    return apiError("Unable to load community data");
  }
}
