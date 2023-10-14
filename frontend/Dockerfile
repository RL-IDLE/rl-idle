FROM node:18-alpine as build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
ENV PORT 3000
ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

RUN npm run build


FROM nginx

COPY --from=build /usr/src/app/dist /var/www/html/

EXPOSE 80

CMD ["nginx","-g","daemon off;"]