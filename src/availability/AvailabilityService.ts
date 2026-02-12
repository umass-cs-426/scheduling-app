import { Availability } from "./Availability";
import { IAvailabilityRepository } from "./AvailabilityRepository";
import { IEventLookup } from "../event/EventLookup";
import { Result, ok, err } from "../types/Result";

export interface IAvailabilityService {
  submit(eventId: string, name: string, timeSlot: string): Result<Availability>;
  list(eventId: string): Availability[];
}

export class AvailabilityService implements IAvailabilityService {
  constructor(
    private repo: IAvailabilityRepository,
    private eventLookup: IEventLookup
  ) {}

  submit(eventId: string, name: string, timeSlot: string): Result<Availability> {
    if (!this.eventLookup.exists(eventId)) {
      return err(`Event ${eventId} does not exist`);
    }

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
