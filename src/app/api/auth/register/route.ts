import { apiSuccess, apiError, apiBadRequest } from "@/lib/apiResponse";
import { findUserByEmail, createUser } from "@/modules/auth/auth.service";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return apiBadRequest("Missing fields");
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return apiBadRequest("Email already in use");
    }

    const user = await createUser({ name, email, password });
    return apiSuccess(user, "User created");
  } catch {
    return apiError("Internal server error");
  }
}
