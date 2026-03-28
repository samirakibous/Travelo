FROM node:22-alpine

WORKDIR /app

# Copier les fichiers workspace (obligatoire : web dépend de packages/@repo/*)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --frozen-lockfile

COPY apps/web ./apps/web

EXPOSE 3001

CMD ["pnpm", "--filter", "web", "dev"]
