FROM node AS build

WORKDIR /src/meeting_fe_app

# cache node_modules
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/meeting_fe_app/dist/angular /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
