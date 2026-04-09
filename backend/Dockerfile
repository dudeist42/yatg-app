FROM node:24-alpine AS base

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

ENV PORT=3000

# --- DEVELOPMENT:WATCH ---
FROM base AS development

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @yatg-app/backend

COPY backend ./backend

WORKDIR /app/backend

EXPOSE $PORT

CMD ["sh", "-c", "pnpm drizzle:migrate:dev && pnpm start:dev"]

# --- BUILDER ---
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @yatg-app/backend

COPY backend ./backend

WORKDIR /app/backend
RUN pnpm build

# --- PRODUCTION ---
FROM base AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

COPY --from=builder --chown=nodejs:nodejs /app/backend/node_modules /app/backend/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/backend/dist /app/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/backend/package.json /app/backend/package.json
COPY --from=builder --chown=nodejs:nodejs /app/backend/drizzle /app/backend/drizzle

WORKDIR /app/backend

RUN pnpm prune --prod

RUN chown -R nodejs:nodejs /app

USER nodejs
EXPOSE $PORT

CMD ["sh", "-c", "pnpm drizzle:migrate:prod && node dist/main"]