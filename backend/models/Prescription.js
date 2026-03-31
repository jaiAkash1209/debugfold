const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, index: true },
  doctor_id: { type: Number, required: true },
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true },
  notes: { type: String, default: "" },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("Prescription", prescriptionSchema);