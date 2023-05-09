FROM node:18

WORKDIR /src

RUN apt-get update && apt-get install -y jq

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build && chmod +x ./dist/main.js
