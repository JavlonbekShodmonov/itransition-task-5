"use client";

import { use, useEffect, useState } from "react";

export default function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params); // ✅ unwrap promise with React.use()
  const [msg, setMsg] = useState("Confirming your email...");

  useEffect(() => {
    async function confirmEmail() {
      try {
        const res = await fetch(`/api/auth/confirm/${token}`, { method: "GET" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMsg("✅ Email confirmed! You can now log in.");
      } catch (err: any) {
        setMsg("❌ Confirmation failed: " + err.message);
      }
    }
    confirmEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 text-center">
        <h1 className="text-xl font-semibold">{msg}</h1>
      </div>
    </div>
  );
}
