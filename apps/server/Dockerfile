# builder stage named "deps"
FROM docker.io/node:lts-alpine as deps

WORKDIR /usr/src/app

COPY dist/apps/server/package*.json ./

# install extracted deps
RUN npm install --only=production

# install additional deps
RUN npm install reflect-metadata tslib rxjs sqlite3 mysql2 pg

# runner stage
FROM docker.io/node:lts-alpine as runner

WORKDIR /usr/src/app

RUN apk add --no-cache dumb-init

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE ${PORT}

# pull in packages from builder stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json

# copy local, compiled app
COPY --chown=node:node dist/apps/server /usr/src/app
RUN chown -R node:node /usr/src/app
USER node

CMD ["dumb-init", "node", "main.js"]
