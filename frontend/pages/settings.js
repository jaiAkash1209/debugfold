import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: "", theme: "light", password: "" });
  const [familyEmail, setFamilyEmail] = useState("");
  const [relationship, setRelationship] = useState("Family");

  useEffect(() => {
    if (user) {
      setForm((current) => ({ ...current, name: user.name, theme: user.theme || "light" }));
    }
  }, [user]);

  async function handleSave(event) {
    event.preventDefault();
    await apiFetch("/settings", { method: "PUT", body: JSON.stringify(form) });
    setUser({ ...user, name: form.name, theme: form.theme });
    document.documentElement.classList.toggle("dark", form.theme === "dark");
  }

  async function handleFamilyLink(event) {
    event.preventDefault();
    await apiFetch("/family", { method: "POST", body: JSON.stringify({ family_email: familyEmail, relationship_label: relationship }) });
    setFamilyEmail("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Profile settings" subtitle="Update your account details">
        <form onSubmit={handleSave} className="space-y-3">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Name" />
          <select value={form.theme} onChange={(event) => setForm({ ...form, theme: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="New password (optional)" type="password" />
          <button className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white">Save changes</button>
        </form>
      </Card>
      {user?.role === "patient" ? (
        <Card title="Family access" subtitle="Grant limited visibility to a family account">
          <form onSubmit={handleFamilyLink} className="space-y-3">
            <input value={familyEmail} onChange={(event) => setFamilyEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Family account email" type="email" />
            <input value={relationship} onChange={(event) => setRelationship(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" placeholder="Relationship" />
            <button className="rounded-2xl bg-accent px-5 py-3 font-semibold text-white">Link family member</button>
          </form>
        </Card>
      ) : (
        <Card title="Notifications" subtitle="Simple in-app alert model">
          <div className="space-y-3 text-sm text-slate-600">
            <p>Appointment updates appear on the appointments page and dashboard.</p>
            <p>Medicine reminders surface as status cards for patient accounts.</p>
          </div>
        </Card>
      )}
    </div>
  );
}