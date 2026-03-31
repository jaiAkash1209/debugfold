import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const navByRole = {
  patient: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/appointments", label: "Appointments" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" }
  ],
  doctor: [
    { href: "/doctor", label: "Doctor Panel" },
    { href: "/appointments", label: "Appointments" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" }
  ],
  family: [
    { href: "/appointments", label: "Appointments" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" }
  ]
};

export default function Layout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const navItems = user ? navByRole[user.role] || [] : [];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">CareSync</Link>
          <nav className="hidden gap-3 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 text-sm font-medium transition hover:scale-[1.03] hover:shadow-soft ${router.pathname === item.href ? "bg-primary text-white" : "bg-slate-100 text-slate-700"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm text-slate-500 sm:inline">{user.name} · {user.role}</span>
                <button onClick={() => { logout(); router.push("/login"); }} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition active:scale-95">Logout</button>
              </>
            ) : (
              <Link href="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Login</Link>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main key={router.pathname} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }} className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </motion.main>
      </AnimatePresence>

      <button onClick={() => window.alert("Emergency alert triggered. Contact local emergency services immediately.")} className="fixed bottom-5 right-5 rounded-full bg-emergency px-5 py-4 text-sm font-bold text-white shadow-soft transition hover:scale-105 active:scale-95">
        Emergency
      </button>
    </div>
  );
}