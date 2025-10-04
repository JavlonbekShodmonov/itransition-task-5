// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { dbConnect } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import { signToken } from "../../../../lib/jwt";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: user not found");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("Input password:", password);
    console.log("Password from DB:", user.password); // Change to user.passwordHash if that’s your field
    console.log("Type of password from DB:", typeof user.password);

    // Compare password
    const ok = await bcrypt.compare(password, user.password); // change to user.passwordHash if needed
    console.log("bcrypt.compare result:", ok);

    if (!ok) {
      console.log("Login failed: wrong password");
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Check status
    if (user.status === "blocked") {
      return NextResponse.json({ message: "Blocked" }, { status: 403 });
    }
    if (user.status !== "active") {
      return NextResponse.json({ message: "Please confirm your email" }, { status: 403 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Sign JWT
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || typeof jwtSecret !== "string") {
    console.error("JWT_SECRET is not defined in environment variables");
    return NextResponse.json({ message: "Server error: JWT secret missing" }, { status: 500 });
  }
  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
    jwtSecret,
    { expiresIn: "1d" }
  );

    // Return JSON and set cookie
    const res = NextResponse.json({
      message: "Logged in",
      user: { id: user._id, email: user.email },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // make sure false on localhost
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
