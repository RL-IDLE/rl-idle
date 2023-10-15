FROM node:20-alpine as build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
ENV PORT 3000
ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
COPY frontend/package.json ./frontend/
RUN npm ci

COPY frontend/scripts/package.json ./frontend/scripts/
COPY frontend/scripts/package-lock.json ./frontend/scripts/
RUN cd frontend/scripts && npm ci

COPY . .

RUN npm run build -w frontend

FROM nginx as frontend

COPY --from=build /usr/src/app/frontend/dist /var/www/html

WORKDIR /var/www/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]