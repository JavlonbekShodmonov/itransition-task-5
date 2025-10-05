import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    const info = await transporter.sendMail({
      from: `Your App <${process.env.GMAIL_USER}>`,
      to: email, // recipient
      subject: subject || "Confirm your email",
      html: `<p>${message || "Thanks for signing up!"}</p>`,
    });

    return NextResponse.json({ 
      messageId: info.messageId,
      accepted: info.accepted,
      response: info.response 
    });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}