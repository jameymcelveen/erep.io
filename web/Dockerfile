FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

ENV VITE_API_URL=http://localhost:8080

CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
