FROM node:18-alpine as build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
ENV PORT 3000
ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
COPY backend/package.json ./backend/
RUN npm ci

COPY backend/scripts/package.json ./backend/scripts/
COPY backend/scripts/package-lock.json ./backend/scripts/
RUN cd backend/scripts && npm ci

COPY . .

RUN npm run build -w backend

FROM node:18-alpine as backend

COPY --from=build /usr/src/app /usr/src/app

WORKDIR /usr/src/app/backend

EXPOSE 3000

CMD [ "bash", "-c", "./scripts/start-docker.sh" ]
