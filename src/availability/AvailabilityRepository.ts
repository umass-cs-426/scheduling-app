import { Availability } from "./Availability";

export interface IAvailabilityRepository {
  save(a: Availability): void;
  findByEventId(eventId: string): Availability[];
}
