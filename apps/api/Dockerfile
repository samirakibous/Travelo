FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
