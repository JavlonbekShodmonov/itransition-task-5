"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("Registered. Check your email to confirm.");
      setName(""); setEmail(""); setPassword("");
    } catch (err: any) {
      setMsg(err.message || "Error registering");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {msg && <div className="mb-4 text-sm text-red-600">{msg}</div>}
        <label className="block mb-2">Name
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded"/>
        </label>
        <label className="block mb-2">Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded"/>
        </label>
        <label className="block mb-4">Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded"/>
        </label>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
        <div className="mt-4 text-center">
          <button type="button" onClick={()=>router.push("/login")} className="text-sm text-blue-600">Already have an account? Login</button>
        </div>
      </form>
    </div>
  );
}
