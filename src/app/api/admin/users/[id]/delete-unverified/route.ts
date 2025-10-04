import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Only allow deleting users that are NOT active or blocked
    if (user.status === "active" || user.status === "blocked") {
      return NextResponse.json(
        { message: "Cannot delete verified/blocked user with this action" },
        { status: 400 }
      );
    }

    await user.deleteOne();

    return NextResponse.json({ message: "Unverified user deleted" });
  } catch (err) {
    console.error("Delete unverified user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
