import { Router } from "express";
import { IEventController } from "./EventController";
import { IAvailabilityController } from "./AvailabilityController";

export function buildRoutes(
  eventController: IEventController,
  availabilityController: IAvailabilityController
): Router {
  const router = Router();

  router.get("/events", eventController.list.bind(eventController));
  router.post("/events", eventController.create.bind(eventController));

  router.get(
    "/events/:eventId/availability",
    availabilityController.listForEvent.bind(availabilityController)
  );

  router.post(
    "/events/:eventId/availability",
    availabilityController.submitForEvent.bind(availabilityController)
  );

  return router;
}
