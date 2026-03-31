import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import ChatbotPanel from "../components/ChatbotPanel";
import NotificationStrip from "../components/NotificationStrip";
import SimpleChart from "../components/SimpleChart";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user?.role === "doctor") {
      router.push("/doctor");
      return;
    }
    if (user?.role === "family") {
      router.push("/appointments");
      return;
    }
    if (user?.role === "patient") {
      apiFetch("/dashboard/patient").then(setData).catch(() => {});
    }
  }, [user, loading, router]);

  if (!data) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  const notifications = [
    ...data.appointments.map((item) => `Appointment ${item.status}: ${item.reason}`),
    ...data.reminders.filter((item) => item.status === "upcoming").map((item) => `Medicine due: ${item.medicine}`)
  ].slice(0, 4);

  const latestMetric = data.metrics[0];

  return (
    <div className="space-y-6">
      <NotificationStrip items={notifications} />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Blood Pressure" value={latestMetric?.blood_pressure || "--"} />
        <StatCard label="Sugar Level" value={latestMetric?.sugar_level || "--"} tone="accent" />
        <StatCard label="Heart Rate" value={latestMetric ? `${latestMetric.heart_rate} bpm` : "--"} tone="emergency" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Recent health trend" subtitle="Quick summary for everyday monitoring">
          <SimpleChart data={data.metrics} />
        </Card>
        <Card title="Medicine reminders" subtitle="Stay on schedule">
          <div className="space-y-3">
            {data.reminders.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">{item.medicine}</p>
                <p className="text-sm text-slate-500">{item.dosage} · {item.timing} · {item.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Upcoming appointments" subtitle="Your next care touchpoints">
          <div className="space-y-3">
            {data.appointments.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-800">{item.reason}</p>
                <p className="text-sm text-slate-500">{new Date(item.date_time).toLocaleString()} with Dr. {item.doctor_name}</p>
              </div>
            ))}
          </div>
        </Card>
        <ChatbotPanel />
      </section>
    </div>
  );
}