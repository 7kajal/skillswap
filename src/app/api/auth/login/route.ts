import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword } from "@/modules/auth/auth.service";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await findUserByEmail(email);
        console.log(user)
        if (!user || !user.password) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const valid = await verifyPassword(password, user.password);
        if (!valid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Credentials valid" },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
