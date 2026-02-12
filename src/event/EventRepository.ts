import { Event } from "./Event";

export interface IEventRepository {
  save(event: Event): void;
  findAll(): Event[];
}
