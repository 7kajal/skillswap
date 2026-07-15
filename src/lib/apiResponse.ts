import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export function apiSuccess<T>(data: T, message = "Success", status = 200): NextResponse {
  return NextResponse.json(
    { success: true, message, data } as ApiResponse<T>,
    { status }
  );
}

export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json(
    { success: false, message, data: null } as ApiResponse<null>,
    { status }
  );
}

export function apiUnauthorized(message = "Unauthorized"): NextResponse {
  return apiError(message, 401);
}

export function apiNotFound(message = "Not found"): NextResponse {
  return apiError(message, 404);
}

export function apiBadRequest(message: string): NextResponse {
  return apiError(message, 400);
}

export function apiConflict(message: string): NextResponse {
  return apiError(message, 409);
}
