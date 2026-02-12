import { Event } from "./Event";
import { IEventRepository } from "./EventRepository";

export class InMemoryEventRepository implements IEventRepository {
  private events: Event[] = [];

  save(event: Event): void {
    this.events.push(event);
  }

  findAll(): Event[] {
    return [...this.events];
  }
}
