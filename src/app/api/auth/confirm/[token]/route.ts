import { NextResponse } from "next/server";
import User from "../../../../../models/User";
import { dbConnect } from "../../../../../lib/mongodb";

export async function GET(
  _: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  try {
    await dbConnect();
    const { token } = await ctx.params;

    const user = await User.findOne({ confirmationToken: token });
    if (!user)
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    if (user.status === "blocked")
      return NextResponse.json({ message: "Blocked" }, { status: 403 });

    // ✅ Set both status and isAdmin
    user.status = "active";
    user.isAdmin = true;
    user.confirmationToken = undefined;
    await user.save();

    // Return JSON instead of redirect - let frontend handle it
    return NextResponse.json({ 
      message: "Email confirmed successfully",
      success: true 
    });
  } catch (error) {
    console.error("Email confirmation error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}