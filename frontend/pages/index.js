import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-soft">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-primary">Connected care for patients and doctors</span>
        </motion.div>
        <h1 className="max-w-2xl text-5xl font-bold leading-tight text-ink">CareSync keeps records, reports, appointments, and reminders in one calm place.</h1>
        <p className="max-w-xl text-lg text-slate-600">Built for real-world use with secure login, simple sharing, and clear navigation.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/signup" className="rounded-2xl bg-primary px-6 py-4 font-semibold text-white transition hover:shadow-soft active:scale-95">Create account</Link>
          <Link href="/login" className="rounded-2xl bg-slate-100 px-6 py-4 font-semibold text-slate-800 transition hover:shadow-soft active:scale-95">Login</Link>
        </div>
      </section>
      <section className="grid gap-4">
        {["Patient dashboard with health trends", "Doctor panel for read-only reports", "Appointment booking and status updates", "Medical reports, prescriptions, reminders"].map((item) => (
          <div key={item} className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="text-base font-semibold text-slate-800">{item}</p>
          </div>
        ))}
      </section>
    </div>
  );
}