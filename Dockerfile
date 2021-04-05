# build environment
FROM node:15.13.0-alpine as build
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf
