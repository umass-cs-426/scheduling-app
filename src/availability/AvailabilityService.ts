import { Availability } from "./Availability";
import { IAvailabilityRepository } from "./AvailabilityRepository";
import { Result, ok } from "../types/Result";

export interface IAvailabilityService {
  submit(eventId: string, name: string, timeSlot: string): Result<Availability>;
  list(eventId: string): Availability[];
}

export class AvailabilityService implements IAvailabilityService {
  constructor(private repo: IAvailabilityRepository) {}

  submit(eventId: string, name: string, timeSlot: string): Result<Availability> {
    const a: Availability = {
      id: crypto.randomUUID(),
      eventId,
      name,
      timeSlot,
    };
    this.repo.save(a);
    return ok(a);
  }

  list(eventId: string): Availability[] {
    return this.repo.findByEventId(eventId);
  }
}
