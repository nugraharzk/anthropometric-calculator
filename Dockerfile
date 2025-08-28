# syntax=docker/dockerfile:1

FROM oven/bun:1 AS build
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the app
COPY . .
RUN bun run build

# Serve the built assets with NGINX
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

