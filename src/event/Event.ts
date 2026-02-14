// An Event represents a scheduled occurrence with a title and date.

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
