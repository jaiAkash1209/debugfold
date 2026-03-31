import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", date_time: "", reason: "" });

  async function loadData() {
    const [appointmentData, doctorData] = await Promise.all([apiFetch("/appointments"), apiFetch("/appointments/doctors")]);
    setAppointments(appointmentData);
    setDoctors(doctorData);
  }

  useEffect(() => {
    loadData().catch(() => {});
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await apiFetch("/appointments", { method: "POST", body: JSON.stringify(form) });
    setForm({ doctor_id: "", date_time: "", reason: "" });
    loadData();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {(user?.role === "patient" || user?.role === "family") && (
        <Card title="Book appointment" subtitle="Quick scheduling with available doctors">
          <form onSubmit={handleSubmit} className="space-y-3">
            <select value={form.doctor_id} onChange={(event) => setForm({ ...form, doctor_id: Number(event.target.value) })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
              <option value="">Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>Dr. {doctor.name} · {doctor.specialization}</option>
              ))}
            </select>
            <input type="datetime-local" value={form.date_time} onChange={(event) => setForm({ ...form, date_time: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <input value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="Reason for visit" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <button className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white">Book now</button>
          </form>
        </Card>
      )}
      <Card title="Appointments" subtitle="Live status across roles">
        <div className="space-y-4">
          {appointments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.reason}</p>
                  <p className="text-sm text-slate-500">{new Date(item.date_time).toLocaleString()} · {item.patient_name} with Dr. {item.doctor_name}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}