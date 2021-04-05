FROM node:15.13.0-alpine as build
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install --network-timeout 1000000
COPY . .
RUN yarn build