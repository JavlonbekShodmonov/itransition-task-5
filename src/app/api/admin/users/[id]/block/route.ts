import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";
import { verifyToken } from "../../../../../../lib/jwt";

// PATCH /api/admin/users/[id]/block
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  // 1. Get token from cookies
  const cookie = req.headers.get("cookie") || "";
  const tokenMatch = cookie.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const payload: any = verifyToken(token);
  if (!payload?.id) return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  if (!payload.isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const me = await User.findById(payload.id);
  if (!me || me.status === "blocked") {
    return NextResponse.json({ message: "Blocked" }, { status: 403 });
  }

  // 2. Block the target user
  const { id } = params;
  const userToBlock = await User.findById(id);
  if (!userToBlock) return NextResponse.json({ message: "User not found" }, { status: 404 });

  userToBlock.status = "blocked";
  await userToBlock.save();

  // 3. Return success
  return NextResponse.json({ message: `User ${id} blocked successfully` });
}
