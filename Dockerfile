FROM node:alpine3.11 AS api-test
WORKDIR /usr/code
COPY package*.json ./
RUN npm install 
COPY . .
ENTRYPOINT [ "/bin/sh" ]
