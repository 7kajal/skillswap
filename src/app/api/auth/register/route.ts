import { apiSuccess, apiError, apiBadRequest } from "@/lib/apiResponse";
import { findUserByEmail, createUser } from "@/modules/auth/auth.service";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return apiBadRequest("Missing fields");
    }

    if (password.length < 8) {
      return apiBadRequest("Password must be at least 8 characters");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await findUserByEmail(normalizedEmail);
    if (existing) {
      return apiBadRequest("Email already in use");
    }

    const user = await createUser({ name, email: normalizedEmail, password });
    return apiSuccess(user, "User created");
  } catch (error) {
    console.error("Registration failed:", error);

    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      return apiBadRequest("Email already in use");
    }

    if (
      error instanceof mongoose.Error.MongooseServerSelectionError ||
      error instanceof mongoose.mongo.MongoNetworkError
    ) {
      return apiError(
        "Unable to connect to the database. Please try again shortly.",
        503
      );
    }

    return apiError("Internal server error");
  }
}
