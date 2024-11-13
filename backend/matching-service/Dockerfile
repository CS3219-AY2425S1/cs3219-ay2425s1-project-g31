# ---- Node 22 on Alpine Linux ----
FROM node:22-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app

COPY . .
 
# Generate a partial monorepo with a pruned lockfile for the app
RUN npx turbo prune --scope=matching-service --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
 
#############################################
# ----  Dependencies ----
COPY --from=builder /app/out/json/ .
RUN npm install

#############################################
# ----  App ----
COPY --from=builder /app/out/full/ .
RUN npx turbo build --filter=matching-service

#############################################
# ----  Start ----
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 matching-service
USER matching-service

COPY --from=installer /app .
 
CMD ["node", "backend/matching-service/dist/server"]