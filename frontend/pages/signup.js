import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

function getHomeRoute(role) {
  if (role === "doctor") return "/doctor";
  if (role === "family") return "/appointments";
  return "/dashboard";
}

export default function SignupPage() {
  const router = useRouter();
  const { persistAuth } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient", specialization: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(form) });
      persistAuth(data);
      router.push(getHomeRoute(data.user.role));
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-soft">
      <h1 className="text-3xl font-bold text-ink">Create your CareSync account</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary md:col-span-2" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <select className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="family">Family</option>
        </select>
        <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Specialization (doctor only)" value={form.specialization} onChange={(event) => setForm({ ...form, specialization: event.target.value })} />
        {error ? <p className="text-sm text-emergency md:col-span-2">{error}</p> : null}
        <button className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition active:scale-95 md:col-span-2">Sign up</button>
      </form>
    </div>
  );
}