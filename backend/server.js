require("dotenv").config();

const app = require("./src/app");
const { initializeMysql } = require("./src/config/mysql");
const { connectMongo } = require("./src/config/mongo");

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await initializeMysql();
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`CareSync backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

bootstrap();