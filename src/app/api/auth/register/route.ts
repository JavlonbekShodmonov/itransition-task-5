import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../../../models/User";
import { dbConnect } from "../../../../lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getUniqIdValue(prefix = "") {
  return prefix + crypto.randomBytes(10).toString("hex");
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const token = getUniqIdValue("confirm_");

    const user = await User.create({
      name,
      email,
      password: hashed,
      status: "unverified",
      confirmationToken: token
    });

     const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/confirm/${token}`;
    // ✅ Send confirmation email with Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      html: `
        <p>Hello ${name},</p>
        <p>Please confirm your account by clicking the link below:</p>
<p>Please confirm your account by clicking <a href="${confirmUrl}">this link</a>.</p>      `
    });

    return NextResponse.json({ message: "Registered. Check email to confirm." });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
