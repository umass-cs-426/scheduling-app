---
theme: default
class: text-center
highlighter: shiki
lineNumbers: true
---

# Deck Title

## Subtitle / Branch Name

---

# Agenda

- Topic 1
- Topic 2
- Topic 3
- Code walkthroughs
- Q&A

---

# Code Walkthrough (Start)

```ts
export function createEvent(title: string, date: string) {
  return { title, date }
}
```

---

# Code Walkthrough (Refactor)

```ts {1|2-3}
export function createEvent(title: string, date: string) {
  if (!title || !date) {
    throw new Error('Missing fields')
  }
  return { title, date }
}
```

---

# Side-by-Side Comparison

```ts {1|2}
export interface CreateEventInputDto {
  title: string
  date: string
}
```

```ts {1|2}
export function CreateEventInputDto(title: string, date: string) {
  return { title, date }
}
```

---

# Callouts With Steps

```ts {1|2|3}
export function CreateAvailabilityInputDto(
  eventId: string,
  name: string,
  startTime: string,
  endTime: string,
) {
  return { eventId, name, startTime, endTime }
}
```

---

# Transition Example

```ts {1}
export function SchedulingWebServer(...) {
  // highlight line transitions across slides
}
```

---

# Magic Move (Animated Code Changes)

````md magic-move
```ts
export function createEvent(title: string, date: string) {
  return { title, date }
}
```
```ts
export function createEvent(title: string, date: string) {
  if (!title || !date) {
    throw new Error('Missing fields')
  }
  return { title, date }
}
```
```ts
export function createEvent(title: string, date: string) {
  if (!title || !date) {
    throw new Error('Missing fields')
  }
  return { title, date, createdAt: new Date().toISOString() }
}
```
````

---

# Wrap-Up

- Key takeaways
- Next lecture preview
