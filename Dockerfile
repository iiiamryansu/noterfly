FROM node:20 AS base

# Install Bun

RUN npm install -g bun

##### DEPENDENCIES #####

FROM base AS deps
WORKDIR /app
ARG TIPTAP_PRO_TOKEN

# Install Prisma Client

COPY prisma ./

# Install dependencies based on the preferred package manager
COPY package.json bun.lock .npmrc ./
RUN \
  if [ -f bun.lock ]; then TIPTAP_PRO_TOKEN=${TIPTAP_PRO_TOKEN} bun install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### BUILDER #####

FROM base AS builder
WORKDIR /app
ARG BETTER_AUTH_SECRET

COPY --from=deps /app/node_modules ./node_modules
COPY . .


ENV NEXT_TELEMETRY_DISABLED=1

ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}

RUN \
if [ -f bun.lock ]; then SKIP_ENV_VALIDATION=1 bun run build; \
else echo "Lockfile not found." && exit 1; \
fi

##### RUNNER #####

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

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
