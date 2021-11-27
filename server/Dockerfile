FROM node:15.12.0-alpine3.13

WORKDIR /src/meeting_server_app

# cache node_modules
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD "npm" "run" "start:prod"
