# 1) Start from a small, modern Node LTS base image.
FROM node:24.13.0-alpine3.23

# 2) Set the working directory inside the container.
WORKDIR /app

# 3) Copy dependency files first so Docker can cache installs.
COPY package.json package-lock.json ./
# 4) Install all dependencies using npm ci (clean, repeatable installs).
RUN npm ci

# 5) Copy the rest of the source code.
COPY . .
# 6) Build the TypeScript code into JavaScript.
RUN npm run build

# 7) Document the port the app listens on.
EXPOSE 3000
# 8) Start the app.
CMD ["npm", "start"]
