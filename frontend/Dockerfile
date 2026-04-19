FROM node:24-alpine AS base

RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

ENV PORT=3000

# --- DEVELOPMENT:WATCH ---
FROM base AS development

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @yatg-app/frontend

COPY frontend ./frontend

WORKDIR /app/frontend

ENV WATCHPACK_POLLING=true
EXPOSE $PORT

CMD ["sh", "-c", "pnpm dev"]

# --- BUILD ---
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @yatg-app/frontend

COPY frontend ./frontend

WORKDIR /app/frontend
RUN pnpm build

# --- PRODUCTION ---
FROM base AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

COPY --from=builder --chown=nodejs:nodejs /app/frontend/public ./public

RUN mkdir .next
RUN chown nodejs:nodejs .next

COPY --from=builder --chown=nodejs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/frontend/.next/static ./.next/static

USER nodejs

ENV HOSTNAME=0.0.0.0
EXPOSE $PORT

CMD ["node", "server.js"]




