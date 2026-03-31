const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, index: true },
  uploaded_by: { type: Number, required: true },
  shared_with: { type: [Number], default: [] },
  file_url: { type: String, required: true },
  file_name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("Report", reportSchema);