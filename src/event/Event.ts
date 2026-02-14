// The Event type represents an event with an id, title, and date.
// type Event = { id: string; title: string; date: string }
// export default Event

export interface Event {
  id: string
  title: string
  date: string
}

class StandardEvent implements Event {
  constructor(
    public id: string,
    public title: string,
    public date: string,
  ) {}
}

export default function Event(title: string, date: string): Event {
  const id = Math.random().toString(36).substring(2, 9)
  return new StandardEvent(id, title, date)
}
