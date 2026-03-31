const OpenAI = require("openai");
const Report = require("../models/Report");
const { getMysql } = require("../src/config/mysql");

function getOpenAiClient() {
  return process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
}

async function handleChat(req, res, next) {
  try {
    const prompt = (req.body.message || "").toLowerCase();
    const pool = getMysql();

    if (prompt.includes("appointment")) {
      const [appointments] = await pool.query(`SELECT date_time, status, reason FROM appointments WHERE patient_id = ? ORDER BY date_time ASC LIMIT 5`, [req.user.id]);
      return res.json({
        source: "rules",
        answer: appointments.length > 0 ? `You have ${appointments.length} appointment(s). The next one is for ${appointments[0].reason} with status ${appointments[0].status}.` : "You do not have any appointments yet."
      });
    }

    if (prompt.includes("report")) {
      const reports = await Report.find({ user_id: req.user.id }).sort({ date: -1 }).limit(5).lean();
      return res.json({
        source: "rules",
        answer: reports.length > 0 ? `You have ${reports.length} report(s). The latest report is \"${reports[0].description}\".` : "You do not have any reports yet."
      });
    }

    const client = getOpenAiClient();
    if (!client) {
      return res.json({ source: "fallback", answer: "I can help with appointments and reports. Try asking: Show my appointments." });
    }

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are CareSync assistant. Give short healthcare admin help only. Do not provide medical diagnosis." },
        { role: "user", content: req.body.message }
      ]
    });

    res.json({ source: "openai", answer: completion.choices[0]?.message?.content || "No response generated." });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };