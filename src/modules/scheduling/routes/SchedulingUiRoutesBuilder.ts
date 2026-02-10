import { Router } from "express";
import SchedulingPageController from "../controller/SchedulingPageController";
import { asyncHandler } from "../../../lib/http";

export default class SchedulingUiRoutesBuilder {
  static build(controller: SchedulingPageController): Router {
    const router = Router();
    router.get("/events", asyncHandler(controller.listPage.bind(controller)));
    router.get("/events/new", asyncHandler(controller.newPage.bind(controller)));
    router.get("/events/:eventId", asyncHandler(controller.detailPage.bind(controller)));
    return router;
  }
}
