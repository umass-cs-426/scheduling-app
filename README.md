# Scheduler Modular Monolith Demo

## Local dev
npm install
npm run dev

## REST Client
Open `requests.http` in VS Code and run requests in order.

## Docker
docker build -t scheduler .
docker run -p 3000:3000 scheduler
