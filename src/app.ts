import express from "express";
import path from "node:path";

import { InMemoryEventRepository } from "./event/InMemoryEventRepository";
import { EventService } from "./event/EventService";
import { EventController } from "./web/EventController";
import { buildRoutes } from "./web/routes";

const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "ui", "views"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.render("index"));

const eventRepo = new InMemoryEventRepository();
const eventService = new EventService(eventRepo);
const eventController = new EventController(eventService);

app.use(buildRoutes(eventController));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
