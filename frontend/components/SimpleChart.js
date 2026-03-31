export default function SimpleChart({ data }) {
  const values = data.map((item) => item.heart_rate || 0);
  const max = Math.max(...values, 1);

  return (
    <div className="space-y-3">
      <div className="flex h-40 items-end gap-3 rounded-3xl bg-slate-50 p-4">
        {data.slice().reverse().map((item) => (
          <div key={item.metric_date} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-2xl bg-primary transition-all" style={{ height: `${Math.max((item.heart_rate / max) * 120, 20)}px` }} />
            <span className="text-xs text-slate-500">{item.metric_date?.slice(5)}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500">Heart rate trend from recent health entries</p>
    </div>
  );
}