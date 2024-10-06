# ---- Node 22 on Alpine Linux ----
FROM node:22-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

# Generate a partial monorepo with a pruned lockfile for the app
RUN npx turbo prune --scope=frontend --docker

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
ENV NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3002
ENV NEXT_PUBLIC_QUESTION_SERVICE_URL=http://localhost:3004
ENV NEXTAUTH_SECRET=a2ca69058c7da5cf77aa626555e62a3124973b3e3459fe66d874abe71777d3fb
RUN npx turbo build --filter=frontend

#############################################
# ----  Start ----
FROM base AS runner
WORKDIR /app
COPY ./frontend/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 frontend
COPY --from=installer --chown=frontend:nodejs /app .

# Don't run production as root
USER frontend

# CD into frontend before running "next start"
WORKDIR /app/frontend

# Expose website port and start web app
EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "run", "start"]