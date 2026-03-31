import { useState } from "react";
import Card from "./Card";
import { apiFetch } from "../lib/api";

export default function ChatbotPanel() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("Ask about appointments or reports.");
  const [loading, setLoading] = useState(false);

  async function handleAsk(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/chatbot", { method: "POST", body: JSON.stringify({ message }) });
      setAnswer(data.answer);
      setMessage("");
    } catch (error) {
      setAnswer(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="CareSync Assistant" subtitle="Quick help for records and appointments">
      <form onSubmit={handleAsk} className="space-y-3">
        <div className="flex gap-3">
          <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Show my appointments" className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary" />
          <button type="button" onClick={() => setMessage("Show reports")} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition active:scale-95">Mic</button>
          <button type="submit" className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition active:scale-95">{loading ? "..." : "Ask"}</button>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{answer}</div>
      </form>
    </Card>
  );
}