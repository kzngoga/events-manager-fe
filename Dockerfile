FROM node:18-alpine

RUN apk update && apk upgrade
RUN apk add yarn

WORKDIR /event-manager-fe-app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "dev"]