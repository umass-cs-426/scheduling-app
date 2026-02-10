import { Router } from "express";
import SchedulingController from "../controller/SchedulingController";
import { asyncHandler } from "../../../lib/http";

export default class SchedulingRoutesBuilder {
    static build(controller: SchedulingController): Router {
        const router = Router();

        // Bind controllers to router
        // This is a common pattern when using classes with Express. 
        // It ensures that `this` inside the controller methods refers to the controller instance.
        const createEventHandler = controller.createEvent.bind(controller);
        const listEventsHandler = controller.listEvents.bind(controller);
        const getEventHandler = controller.getEvent.bind(controller);
        const resetHandler = controller.reset.bind(controller);

        // Register routes
        router.post("/events", asyncHandler(createEventHandler));
        router.get("/events", asyncHandler(listEventsHandler));
        router.get("/events/:eventId", asyncHandler(getEventHandler));
        router.post("/reset", asyncHandler(resetHandler));

        return router;
    }
}
