FROM oven/bun:latest as build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bunx prisma generate
RUN bun run build
CMD ["bun", "run", "start:dev"]