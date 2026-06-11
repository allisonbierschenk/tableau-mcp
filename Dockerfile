# Builder stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install all dependencies and skip lifecycle scripts
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY src ./src
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Copy package files and feature config; install production dependencies without scripts.
# features.json must be present at /app/features.json — featureGate.ts reads it at startup
# and crashes with ENOENT if missing, which cascades into "An unexpected error occurred
# while getting MCP settings for site." on every MCP request.
COPY package.json package-lock.json features.json ./
RUN npm ci --omit=dev --production --ignore-scripts

# Copy built artifacts from builder
COPY --from=builder /app/build ./build

# Ensure executable permission
RUN chmod +x build/index.js

# Use node to run the MCP server
ENTRYPOINT ["node", "build/index.js"]
