# build environment
FROM node:15.13.0-alpine as build
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install --network-timeout 1000000
COPY . .
RUN yarn build

# runtime environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/ /etc/nginx/conf.d/
