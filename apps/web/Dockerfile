FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web

EXPOSE 3001

WORKDIR /app/apps/web

CMD ["pnpm", "exec", "next", "dev", "--port", "3001"]
