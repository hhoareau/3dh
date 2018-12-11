# étape de build
#FROM node:9.11.1-alpine as build-stage
FROM arm32v7/node as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./node_modules/@types/vue-material/index.d.ts /node_modules/@types/vue-material
RUN npm run build

# étape de production
#FROM nginx:1.13.12-alpine as production-stage
FROM arm32v7/nginx as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]