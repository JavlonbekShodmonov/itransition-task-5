import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    const data = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",  // test domain provided by Resend
      to: email, // recipient
      subject: subject || "Confirm your email",
      html: `<p>${message || "Thanks for signing up!"}</p>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
