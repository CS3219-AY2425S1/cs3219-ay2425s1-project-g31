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
    RUN npx turbo build --filter=frontend
    
    #############################################
    # ----  Start ----
    FROM base AS runner
    WORKDIR /app
    
    # Don't run production as root
    RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 frontend
    USER frontend
    
    COPY --from=installer /app .
    
    # CD into frontend before running "next start"
    WORKDIR /app/frontend

    # Expose website port and start web app
    EXPOSE 3000
    CMD ["npm", "run", "start"]