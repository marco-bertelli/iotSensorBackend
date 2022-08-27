FROM node:buster-slim

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev 

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

COPY tensorflow ./build

CMD ["node", "./build"]



