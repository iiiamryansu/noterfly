# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock .npmrc ./
ARG TIPTAP_PRO_TOKEN
RUN \
  if [ -f bun.lock ]; then TIPTAP_PRO_TOKEN=${TIPTAP_PRO_TOKEN} bun install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG SKIP_ENV_VALIDATION

ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION}

RUN bunx prisma generate --no-engine

RUN \
  if [ -f bun.lock ]; then bun run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "server.js"]
