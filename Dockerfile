FROM oven/bun:1 AS base

##### DEPENDENCIES #####

FROM base AS deps
WORKDIR /app

# Install Prisma Client

COPY prisma ./

# Install dependencies based on the preferred package manager
COPY package.json bun.lock .npmrc ./
ARG TIPTAP_PRO_TOKEN
RUN \
  if [ -f bun.lock ]; then TIPTAP_PRO_TOKEN=${TIPTAP_PRO_TOKEN} bun install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### BUILDER #####

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
if [ -f bun.lock ]; then SKIP_ENV_VALIDATION=1 bun run build; \
else echo "Lockfile not found." && exit 1; \
fi

##### RUNNER #####

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

ENV BETTER_AUTH_SECRET=
ENV BETTER_AUTH_URL=
ENV CLOUDFLARE_R2_ACCESS_KEY_ID=
ENV CLOUDFLARE_R2_ACCOUNT_ID=
ENV CLOUDFLARE_R2_BUCKET=
ENV CLOUDFLARE_R2_PUBLIC_URL=
ENV CLOUDFLARE_R2_SECRET_ACCESS_KEY=
ENV DATABASE_URL=
ENV RESEND_API_KEY=

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["bun", "server.js"]
