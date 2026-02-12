import express from "express";
import path from "node:path";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "ui", "views"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.render("index"));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
