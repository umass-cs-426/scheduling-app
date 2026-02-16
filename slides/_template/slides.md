---
theme: default
transition: fade
class: text-center
highlighter: shiki
lineNumbers: true
addons:
  - slidev-addon-asciinema
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

# Interactive Code (Monaco)

```ts {monaco}
export function add(a: number, b: number) {
  return a + b
}
```

---

# Runnable Code (Monaco Run)

```ts {monaco-run}
function greet(name: string) {
  return `Hello, ${name}!`
}

console.log(greet('Slidev'))
```

---

# Terminal Demo AGAIN

<Asciinema 
  src="https://asciinema.org/a/P3Ppzc6cNbUcN9Vh" 
  :playerProps="{ 
    theme: 'asciinema',
    terminalFontFamily: 'monospace',
    cols: 80,
    rows: 20,
    fit: 'width'
  }" 
/>

<style>
/* Use :deep() to reach inside the Shadow DOM of the asciinema component */
:deep(.asciinema-terminal span) {
  color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Ensure the player doesn't have a zero-height container */
:deep(.asciinema-player) {
  min-height: 400px !important;
}
</style>

---

# Terminal Demo (Asciinema)

Use the local cast file in `public/demo.cast` (already in this template).

<Asciinema src="/demo.cast" />

---

# Terminal Demo (Asciinema)

Use the local cast file in `public/demo.cast` (already in this template).

# Customized Example

<Asciinema src="/demo.cast" 
  :playerProps="{ speed: 2, rows: 23, autoPlay: true, fit: 'width', theme: 'monokai' }" />

---

# Wrap-Up

- Key takeaways
- Next lecture preview

<style>
/* 1. Force the terminal text to be bright white */
html body .asciinema-terminal, 
html body .asciinema-terminal span,
html body .asciinema-terminal b,
html body .asciinema-terminal i {
  color: #FFFFFF !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: inline !important;
}

/* 2. Force the background to be solid black so you can see the white text */
html body .asciinema-player-container,
html body .asciinema-player {
  background-color: #000000 !important;
  min-height: 300px !important;
}
</style>
