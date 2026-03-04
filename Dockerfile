# ---- Stage 1: Install dependencies ----
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: Build the application ----
FROM node:24-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DEPLOY_TARGET=node
ENV TURSO_CONNECTION_URL=libsql://dummy
RUN npx vite build

# ---- Stage 3: Production image ----
FROM node:24-alpine AS production

WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create data directory for SQLite and set permissions
RUN mkdir -p /app/data && chown appuser:appgroup /app/data

# Copy built output and dependencies
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Copy source and migration files needed to run drizzle-kit in production
COPY --from=build /app/drizzle.config.ts ./
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/src/lib/server/db ./src/lib/server/db

# SvelteKit adapter-node settings
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

USER appuser

EXPOSE 3000

# Run migrations and then start the server
CMD ["sh", "-c", "npx drizzle-kit migrate && (npm run db:seed || true) && node build"]
