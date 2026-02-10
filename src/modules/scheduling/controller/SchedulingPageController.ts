import type { Request, Response } from "express";
import SchedulingService from "../service/SchedulingService";
import { renderResult } from "../../../lib/http";

export default class SchedulingPageController {
  constructor(private readonly service: SchedulingService) {}

  async listPage(_req: Request, res: Response): Promise<void> {
    const result = await this.service.listEvents();
    renderResult(res, result, "scheduling/list", { title: "Scheduling" });
  }

  async newPage(_req: Request, res: Response): Promise<void> {
    res.render("scheduling/form", { title: "New Event" });
  }

  async detailPage(req: Request, res: Response): Promise<void> {
    const result = await this.service.getEvent(req.params.eventId as string);
    renderResult(res, result, "scheduling/detail", { title: "Event" });
  }
}
