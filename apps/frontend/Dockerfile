# 의존성 설치
FROM node:20-alpine AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# 빌드
FROM deps AS build

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY apps/frontend ./apps/frontend
RUN pnpm --filter ./apps/frontend build

# 실행
FROM node:20-alpine AS runner

ENV NODE_ENV="production"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=build --chown=nextjs:nodejs \
  /app/apps/frontend/.next/standalone ./

COPY --from=build --chown=nextjs:nodejs \
  /app/apps/frontend/.next/static ./apps/frontend/.next/static

COPY --from=build --chown=nextjs:nodejs \
  /app/apps/frontend/public ./apps/frontend/public

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/frontend/server.js"]