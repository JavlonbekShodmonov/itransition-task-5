import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { verifyToken } from "../../../../lib/jwt";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("🔎 API /admin/users sees token:", token);

  if (!token) {
    console.log("❌ No token found in cookies");
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await verifyToken(token);
    console.log("✅ Verified token payload:", payload);
  } catch (err: any) {
    console.log("❌ Token verification failed:", err.message);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (!payload?.id) {
    console.log("❌ Payload missing id");
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (!payload.isAdmin) {
    console.log("❌ Not an admin user");
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const me = await User.findById(payload.id);
  if (!me) {
    console.log("❌ User not found in DB");
    return NextResponse.json({ message: "Blocked" }, { status: 403 });
  }
  if (me.status === "blocked") {
    console.log("❌ User is blocked");
    return NextResponse.json({ message: "Blocked" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") === "asc" ? 1 : -1;

  console.log("📊 Sorting users by lastLogin:", sort);

  const users = await User.find().sort({ lastLogin: sort }).lean();
  console.log("✅ Found users count:", users.length);

  return NextResponse.json({ users });
}
