"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [msg, setMsg] = useState("Confirming...");
  const router = useRouter();

  useEffect(() => {
    if(!token) return;
  async function confirmEmail() {
    try {
      const res = await fetch(`/api/auth/confirm/${token}`, { method: "GET" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("✅ Email confirmed! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000); // redirect after 2s
    } catch (err: any) {
      setMsg("❌ Confirmation failed: " + err.message);
    }
  }
  confirmEmail();
}, [token]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow text-center">
        <p>{msg}</p>
        <div className="mt-4">
          <button onClick={()=>router.push("/login")} className="px-4 py-2 bg-blue-600 text-white rounded">Go to Login</button>
        </div>
      </div>
    </div>
  );
}
