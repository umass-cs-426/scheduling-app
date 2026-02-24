const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
const apiBaseUrl = process.env.API_BASE_URL || "http://api:3001";

app.use(express.json());

function pageHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Compose Activity - Web</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2rem; line-height: 1.4; }
    h1 { margin-bottom: .5rem; }
    .row { display: flex; gap: .5rem; flex-wrap: wrap; margin: .75rem 0; }
    input, button { font-size: 1rem; padding: .5rem .75rem; }
    .panel { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-top: 1rem; }
    pre { background: #f5f5f5; padding: .75rem; border-radius: 6px; overflow: auto; }
    .hint { color: #555; }
  </style>
</head>
<body>
  <h1>Compose Activity Web</h1>
  <p class="hint">This frontend proxies requests to the API service. If the API is down, the UI will only show a generic failure.</p>

  <div class="row">
    <button id="check-health">Check API Health</button>
    <button id="load-events">Load Events</button>
  </div>

  <div class="row">
    <input id="title" placeholder="New event title" value="Team sync" />
    <button id="create-event">Create Event</button>
  </div>

  <div class="panel">
    <strong>Status</strong>
    <pre id="status">Ready.</pre>
  </div>

  <script>
    const statusEl = document.getElementById("status");
    const setStatus = (value) => {
      statusEl.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    };

    async function call(path, options) {
      const res = await fetch(path, options);
      const data = await res.json().catch(() => ({ error: "Invalid JSON response" }));
      setStatus({ status: res.status, data });
    }

    document.getElementById("check-health").addEventListener("click", () => call("/api/health"));
    document.getElementById("load-events").addEventListener("click", () => call("/api/events"));
    document.getElementById("create-event").addEventListener("click", () => {
      const title = document.getElementById("title").value.trim();
      call("/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });
    });
  </script>
</body>
</html>`;
}

async function proxyJson(req, res, upstreamPath, options = {}) {
  try {
    const upstream = await fetch(`${apiBaseUrl}${upstreamPath}`, options);
    const text = await upstream.text();
    res.status(upstream.status);
    res.type(upstream.headers.get("content-type") || "application/json");
    res.send(text);
  } catch (error) {
    res.status(502).json({
      ok: false,
      error: "API request failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

app.get("/", (_req, res) => {
  res.type("html").send(pageHtml());
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "web" });
});

app.get("/api/health", async (req, res) => {
  await proxyJson(req, res, "/health");
});

app.get("/api/events", async (req, res) => {
  await proxyJson(req, res, "/events");
});

app.post("/api/events", async (req, res) => {
  await proxyJson(req, res, "/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body || {}),
  });
});

app.listen(port, () => {
  console.log(`web listening on ${port}, proxying to ${apiBaseUrl}`);
});
