const express = require("express");
const { Pool } = require("pg");

const port = Number(process.env.PORT || 3001);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing required env var: DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function verifyDatabaseConnection() {
  const result = await pool.query("SELECT 1 AS ok");
  return result.rows[0];
}

async function start() {
  try {
    await verifyDatabaseConnection();
    await ensureSchema();
    console.log("api connected to database");
  } catch (error) {
    console.error("api startup failed while connecting to database");
    console.error(error);
    process.exit(1);
  }

  const app = express();
  app.use(express.json());

  app.get("/health", async (_req, res) => {
    try {
      await verifyDatabaseConnection();
      res.json({ ok: true, service: "api" });
    } catch (error) {
      res.status(500).json({
        ok: false,
        service: "api",
        error: error instanceof Error ? error.message : "unknown error",
      });
    }
  });

  app.get("/events", async (_req, res) => {
    const result = await pool.query(
      "SELECT id, title, created_at FROM events ORDER BY id DESC"
    );
    res.json({ ok: true, events: result.rows });
  });

  app.post("/events", async (req, res) => {
    const title = String(req.body?.title || "").trim();
    if (!title) {
      return res.status(400).json({ ok: false, error: "title is required" });
    }

    const result = await pool.query(
      "INSERT INTO events (title) VALUES ($1) RETURNING id, title, created_at",
      [title]
    );
    const event = result.rows[0];

    // Part 2 activity: send an HTTP notification to process.env.NOTIFIER_URL.
    // Example:
    // await fetch(`${process.env.NOTIFIER_URL}/notify`, {
    //   method: "POST",
    //   headers: { "content-type": "application/json" },
    //   body: JSON.stringify({ type: "event.created", id: event.id }),
    // });

    return res.status(201).json({ ok: true, event });
  });

  app.listen(port, () => {
    console.log(`api listening on ${port}`);
  });
}

start();
