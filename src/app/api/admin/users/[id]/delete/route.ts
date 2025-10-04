import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await user.deleteOne();

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}