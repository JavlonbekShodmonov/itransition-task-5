import { NextResponse } from "next/server";
import User from "../../../../../models/User";
import { dbConnect } from "../../../../../lib/mongodb";

export async function GET(
  _: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  try {
    await dbConnect();
    const { token } = await ctx.params; // ✅ unwrap params

    const user = await User.findOne({ confirmationToken: token });
    if (!user)
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    if (user.status === "blocked")
      return NextResponse.json({ message: "Blocked" }, { status: 403 });

    user.status = "active";
    user.confirmationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL("/admin/users", "http://localhost:3552"));
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
