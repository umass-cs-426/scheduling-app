const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3002);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "notifier" });
});

app.post("/notify", (req, res) => {
  console.log("notifier received payload:", JSON.stringify(req.body));
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`notifier listening on ${port}`);
});
