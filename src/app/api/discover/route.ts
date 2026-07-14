import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findMatches } from "@/lib/matching";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matches = await findMatches(session.user.id);
  return NextResponse.json(matches);
}
