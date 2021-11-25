# FROM ubuntu:16.04 AS build
FROM node:14.17.6 AS build

WORKDIR /src/meeting_fe_app

# RUN apt-get update
# RUN apt-get -y install curl dirmngr apt-transport-https lsb-release ca-certificates sudo
# RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
# RUN sudo apt-get -y install nodejs

# cache node_modules
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/meeting_fe_app/dist/angular /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
