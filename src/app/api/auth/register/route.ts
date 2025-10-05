import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../../../models/User";
import { dbConnect } from "../../../../lib/mongodb";
import nodemailer from "nodemailer";

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
    
    // ✅ Send confirmation email with Nodemailer
    try {
      // Create transporter inside the try block
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Confirm your email",
        html: `
          <p>Hello ${name},</p>
          <p>Please confirm your account by visiting this URL:</p>
          <p>${confirmUrl}</p>
        `
      });
      
      console.log("✅ Email sent successfully to:", email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // User is still created, just email failed
    }

    return NextResponse.json({ message: "Registered. Check email to confirm." });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }
    console.error("Server error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}