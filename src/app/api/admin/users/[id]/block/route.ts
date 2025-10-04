import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/User";


interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: Request, {params}: Params) {
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
