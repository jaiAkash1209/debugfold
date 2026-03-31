import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

function getHomeRoute(role) {
  if (role === "doctor") return "/doctor";
  if (role === "family") return "/appointments";
  return "/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const { persistAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(form) });
      persistAuth(data);
      router.push(getHomeRoute(data.user.role));
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-ink">Login</h1>
      <p className="mt-2 text-slate-500">Access your health workspace securely.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error ? <p className="text-sm text-emergency">{error}</p> : null}
        <button className="w-full rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition active:scale-95">Login</button>
      </form>
    </div>
  );
}