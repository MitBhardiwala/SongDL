FROM node:22-bookworm-slim AS base

# System deps: ffmpeg (audio conversion) + python3/pip (yt-dlp) + curl (fetch yt-dlp binary)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp as a standalone binary (avoids pip/venv headaches, easy to update)
RUN curl -L https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source + prisma schema
COPY . .

# Generate Prisma client (needs schema present)
RUN npx prisma generate

# Compile TypeScript -> dist/
RUN npm run build

# DOWNLOAD_DIR resolves (via import.meta.dirname) to <app-root>/downloads,
# i.e. one level up from dist/, matching src/config/env.ts's path.join logic.
# Ephemeral: wiped on every redeploy/restart since Render's default disk isn't persistent.
RUN mkdir -p /app/downloads

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]