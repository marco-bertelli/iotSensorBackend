FROM node:16.00-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

CMD ["node", "./build"]



