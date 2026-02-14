export type EventPort = {
  // The exists method checks if an event with the given ID exists. It returns
  // a promise that resolves to true if the event exists, and false otherwise.
  exists: (eventId: string) => Promise<boolean>
}

export const EventPort = () => ({ name: 'EventPort' })
