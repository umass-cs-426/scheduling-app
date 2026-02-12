import { Availability } from "./Availability";
import { IAvailabilityRepository } from "./AvailabilityRepository";

export class InMemoryAvailabilityRepository implements IAvailabilityRepository {
  private rows: Availability[] = [];

  save(a: Availability): void {
    this.rows.push(a);
  }

  findByEventId(eventId: string): Availability[] {
    return this.rows.filter((r) => r.eventId === eventId);
  }
}
