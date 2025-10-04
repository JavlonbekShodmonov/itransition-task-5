import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Toggle block status
  user.status = user.status === "blocked" ? "active" : "blocked";
  await user.save();

  return NextResponse.json({ message: `User ${user.status}` });
}
