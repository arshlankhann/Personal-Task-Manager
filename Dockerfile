#build for client

FROM node:20-alpine as client-builder

COPY ./client /app

WORKDIR /app

RUN npm install 

RUN npm run build

#build for server
FROM node:20-alpine

COPY ./server /app

WORKDIR /app

RUN npm install

COPY --from=client-builder /app/dist /app/build

CMD ["node", "index.js"]