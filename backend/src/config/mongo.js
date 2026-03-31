const mongoose = require("mongoose");

async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/caresync";
  await mongoose.connect(mongoUri);
}

module.exports = { connectMongo };