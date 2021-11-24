FROM node:15.12.0-alpine3.13

ENV PORT=24000

WORKDIR /src/heo

# cache node_modules
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 24000

CMD "npm" "run" "start"