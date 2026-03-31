export default function NotificationStrip({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white px-3 py-2 shadow-sm">{item}</span>
        ))}
      </div>
    </div>
  );
}