# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /repo

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/back/package.json ./apps/back/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code (only specific directories and files)
COPY apps/back/src ./apps/back/src
COPY apps/back/prisma ./apps/back/prisma
COPY apps/back/tsconfig.json ./apps/back/tsconfig.json
COPY apps/back/tsconfig.build.json ./apps/back/tsconfig.build.json
COPY apps/back/nest-cli.json ./apps/back/nest-cli.json

# Generate Prisma client
WORKDIR /repo/apps/back
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /repo

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/back/package.json ./apps/back/

# Copy node_modules from builder stage (includes all dependencies)
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/back/node_modules ./apps/back/node_modules

# Copy built application
COPY --from=builder /repo/apps/back/dist ./apps/back/dist
COPY --from=builder /repo/apps/back/prisma ./apps/back/prisma
COPY --from=builder /repo/apps/back/generated ./apps/back/generated

# Expose port
EXPOSE 3000

# Change to app directory
WORKDIR /repo/apps/back

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start:prod"] 