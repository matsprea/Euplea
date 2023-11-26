FROM node:lts-alpine as dependencies
RUN apk add --no-cache libc6-compat
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
WORKDIR /my-project
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:lts-alpine as builder
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
WORKDIR /my-project
COPY . .
COPY --from=dependencies /my-project/node_modules ./node_modules
RUN pnpm build

FROM node:lts-alpine as runner
WORKDIR /my-project

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /my-project/next-i18next.config.js ./
COPY --from=builder /my-project/public ./public
COPY --from=builder --chown=nextjs:nodejs /my-project/.next ./.next
COPY --from=builder /my-project/node_modules ./node_modules
COPY --from=builder /my-project/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["pnpm", "start"]