FROM node:22-alpine

WORKDIR /app

COPY apps/api/package.json ./

RUN npm install --legacy-peer-deps

COPY apps/api .

EXPOSE 3000

CMD ["npx", "nest", "start", "--watch"]
