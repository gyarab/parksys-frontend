FROM mhart/alpine-node:latest

WORKDIR /app
ADD . .

RUN npm install
RUN npm run build:prod

EXPOSE 8889

CMD ["npm", "run", "start:prod"]
