import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.status = "blocked";
    await user.save();

    return NextResponse.json({ message: "User blocked", user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
