import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { API_URL, apiFetch } from "../lib/api";

export default function DoctorPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [prescription, setPrescription] = useState({ user_id: "", medicine: "", dosage: "", timing: "", notes: "" });
  const [reportForm, setReportForm] = useState({ user_id: "", description: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user?.role !== "doctor") {
      return;
    }
    apiFetch("/dashboard/doctor").then(setOverview).catch(() => {});
  }, [user, loading, router]);

  async function refresh() {
    setOverview(await apiFetch("/dashboard/doctor"));
  }

  async function updateStatus(id, status) {
    await apiFetch(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    await refresh();
  }

  async function submitPrescription(event) {
    event.preventDefault();
    await apiFetch("/reports/prescriptions", { method: "POST", body: JSON.stringify(prescription) });
    setPrescription({ user_id: "", medicine: "", dosage: "", timing: "", notes: "" });
  }

  async function submitReport(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", reportForm.user_id);
    formData.append("description", reportForm.description);
    await apiFetch("/reports/upload", { method: "POST", body: formData });
    setReportForm({ user_id: "", description: "" });
    setFile(null);
    await refresh();
  }

  if (!overview) {
    return <p className="text-slate-500">Loading doctor panel...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Appointments" subtitle="Accept or reject patient requests">
          <div className="space-y-4">
            {overview.appointments.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-800">{item.patient_name}</p>
                <p className="text-sm text-slate-500">Patient ID {item.patient_id} - {item.reason} - {new Date(item.date_time).toLocaleString()}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => updateStatus(item.id, "accepted")} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">Accept</button>
                  <button onClick={() => updateStatus(item.id, "rejected")} className="rounded-xl bg-emergency px-4 py-2 text-sm font-semibold text-white">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Add prescription" subtitle="Append-only patient instruction">
          <form onSubmit={submitPrescription} className="space-y-3">
            <input value={prescription.user_id} onChange={(event) => setPrescription({ ...prescription, user_id: event.target.value })} placeholder="Patient user ID" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <input value={prescription.medicine} onChange={(event) => setPrescription({ ...prescription, medicine: event.target.value })} placeholder="Medicine" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <div className="grid gap-3 md:grid-cols-2">
              <input value={prescription.dosage} onChange={(event) => setPrescription({ ...prescription, dosage: event.target.value })} placeholder="Dosage" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
              <input value={prescription.timing} onChange={(event) => setPrescription({ ...prescription, timing: event.target.value })} placeholder="Timing" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            </div>
            <textarea value={prescription.notes} onChange={(event) => setPrescription({ ...prescription, notes: event.target.value })} placeholder="Notes" className="h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <button className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white">Save prescription</button>
          </form>
        </Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card title="Upload patient report" subtitle="Append a new report to a patient record">
          <form onSubmit={submitReport} className="space-y-3">
            <input value={reportForm.user_id} onChange={(event) => setReportForm({ ...reportForm, user_id: event.target.value })} placeholder="Patient user ID" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <input value={reportForm.description} onChange={(event) => setReportForm({ ...reportForm, description: event.target.value })} placeholder="Report description" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <button className="rounded-2xl bg-accent px-5 py-3 font-semibold text-white">Upload report</button>
          </form>
        </Card>
        <Card title="Shared reports" subtitle="Patient-approved history">
          <div className="grid gap-4 md:grid-cols-2">
            {overview.recentReports.map((report) => (
              <a key={report._id} href={`${API_URL.replace("/api", "")}${report.file_url}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">{report.description}</p>
                <p className="text-sm text-slate-500">{report.file_name}</p>
              </a>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
