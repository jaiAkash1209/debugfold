import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { API_URL, apiFetch } from "../lib/api";

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [shareDoctorId, setShareDoctorId] = useState("");

  async function loadData() {
    const reportData = await apiFetch("/reports");
    const doctorData = await apiFetch("/appointments/doctors");
    setReports(reportData);
    setDoctors(doctorData);
  }

  useEffect(() => {
    loadData().catch(() => {});
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    await apiFetch("/reports/upload", { method: "POST", body: formData });
    setDescription("");
    setFile(null);
    loadData();
  }

  async function handleShare(reportId) {
    if (!shareDoctorId) {
      return;
    }
    await apiFetch(`/reports/share/${reportId}`, { method: "POST", body: JSON.stringify({ doctor_id: Number(shareDoctorId) }) });
    loadData();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      {user?.role === "patient" && (
        <Card title="Upload report" subtitle="PDF or image, saved securely">
          <form onSubmit={handleUpload} className="space-y-3">
            <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
            <button className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white">Upload</button>
          </form>
        </Card>
      )}
      <Card title="Medical records" subtitle="View and share with care teams">
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{report.description}</p>
                  <p className="text-sm text-slate-500">{report.file_name} · {new Date(report.date).toLocaleDateString()}</p>
                </div>
                <a href={`${API_URL.replace("/api", "")}${report.file_url}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">Open file</a>
              </div>
              {user?.role === "patient" && (
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <select value={shareDoctorId} onChange={(event) => setShareDoctorId(event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
                    <option value="">Share with doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>Dr. {doctor.name}</option>
                    ))}
                  </select>
                  <button onClick={() => handleShare(report._id)} className="rounded-2xl bg-accent px-4 py-3 font-semibold text-white">Share</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}