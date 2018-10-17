FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src /app

EXPOSE 3000

CMD [ "node", "--inspect=0.0.0.0:9229", "server.js" ]
