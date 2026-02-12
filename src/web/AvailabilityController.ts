import { Request, Response } from "express";
import { IAvailabilityService } from "../availability/AvailabilityService";

export interface IAvailabilityController {
  listForEvent(req: Request, res: Response): void;
  submitForEvent(req: Request, res: Response): void;
}

export class AvailabilityController implements IAvailabilityController {
  constructor(private service: IAvailabilityService) {}

  listForEvent(req: Request, res: Response): void {
    const eventId = req.params.eventId as string;
    res.json(this.service.list(eventId));
  }

  submitForEvent(req: Request, res: Response): void {
    const eventId = req.params.eventId as string;
    const { name, timeSlot } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "name is required" });
      return;
    }

    if (typeof timeSlot !== "string" || timeSlot.trim() === "") {
      res.status(400).json({ error: "timeSlot is required" });
      return;
    }

    const result = this.service.submit(eventId, name, timeSlot);
    res.status(201).json(result.ok ? result.value : { error: "unexpected" });
  }
}
