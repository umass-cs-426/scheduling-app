# Scheduler Modular Monolith Demo

This repository demonstrates a modular monolith architecture with clear module
boundaries (Event, Availability, Logging), DTOs, and a simple HTML‑first UI
powered by htmx and Alpine.js.

## Local Development

1) Install dependencies
```
npm install
```

2) Run the dev server
```
npm run dev
```

The app will start on port `3000` by default.

### Environment Variables

We load environment variables from `.env` using `dotenv`. A sample file is
provided at `.env.example`. To use it:

```
cp .env.example .env
```

Then edit `.env` if you want a different port.

## REST Client
Open `requests.http` in VS Code and run requests in order.

## Docker

Build the image:
```
docker build -t scheduler .
```

Run the container:
```
docker run --env-file .env -p 3000:3000 scheduler
```

If you do not have a `.env` file, the app will still use the default port.

## Docs

Start here:
- `docs/REPO-GUIDE.md`
- `docs/ARCHITECTURE-NOTES.md`
- `docs/TYPESCRIPT-GUIDE.md`
- `docs/CONFIGURATION-GUIDE.md`
- `docs/UI-GUIDE.md`
- `docs/READING.md`
