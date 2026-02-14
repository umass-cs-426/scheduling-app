# READING

This is a short, focused reading plan that should take a couple of hours. It
mixes our local docs with a few high‑quality, free resources. Each item has a
small purpose so we know why we are reading it.

## Part 1: Understand This Repo (About 45–60 minutes)

1. `docs/REPO-GUIDE.md`  
   Big picture overview of the modular monolith and how code is organized.

2. `docs/ARCHITECTURE-NOTES.md`  
   The two architecture diagrams and why ports make growth easy.

3. `docs/TYPESCRIPT-GUIDE.md`  
   The TypeScript patterns we use (DTOs, factory functions, Result types).

4. `docs/CONFIGURATION-GUIDE.md`  
   How tsconfig, package.json, and package‑lock work together.

5. `docs/UI-GUIDE.md`  
   How the UI is built with server‑side templates, htmx, and Alpine.js.

## Part 2: External References (About 60–90 minutes)

These are free and worth reading. We can skim the first sections now and use
them as references later.

1. TypeScript Handbook (official)  
   https://www.typescriptlang.org/docs/handbook/  
   Read: The Basics, Everyday Types, and Modules.

2. Node.js Documentation (official)  
   https://nodejs.org/docs/latest/api/documentation.html  
   Read: “About this documentation,” then skim a few core modules.

3. Express Documentation (official)  
   https://expressjs.com/  
   Read: Getting Started and Basic Routing.

4. EJS Documentation (official)  
   https://ejs.co/  
   Read: What is EJS, basic syntax, and includes.

5. htmx Documentation (official)  
   https://htmx.org/docs/  
   Read: Core concepts, requests, and swapping.

6. Alpine.js Documentation (official)  
   https://alpinejs.dev/  
   Read: x-data, x-model, and x-on.

7. npm package.json docs (official)  
   https://docs.npmjs.com/cli/v8/configuring-npm/package-json/  
   Read: description + key fields.

8. npm package-lock.json docs (official)  
   https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json/  
   Read: why lockfiles matter.

## Optional, If You Have Time

- Dive deeper into Express middleware and error handling.
- Explore htmx attributes we do not use yet (hx-boost, hx-sse).
- Read about Node’s event loop to connect “async” to runtime behavior.

Remember to keep our minds open as we read. We can understand the main idea
quickly and move forward, then return later for details. It also helps to have
tests because they show us when something is right or wrong.
