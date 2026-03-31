export default function StatCard({ label, value, tone = "primary" }) {
  const toneClass = {
    primary: "bg-blue-50 text-primary",
    accent: "bg-green-50 text-accent",
    emergency: "bg-red-50 text-emergency"
  }[tone];

  return (
    <div className={`rounded-3xl p-5 ${toneClass}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}