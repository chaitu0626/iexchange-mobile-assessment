import { createApp } from "./app";
import { env } from "./config/env";
import { closeDatabase, initDatabase } from "./database/db";

initDatabase();

const app = createApp();
const server = app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

function shutdown() {
  server.close(() => {
    closeDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
