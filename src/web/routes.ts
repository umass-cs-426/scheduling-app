import { Router } from "express";
import { IEventController } from "./EventController";

export function buildRoutes(eventController: IEventController): Router {
  const router = Router();
  router.get("/events", eventController.list.bind(eventController));
  router.post("/events", eventController.create.bind(eventController));
  return router;
}
