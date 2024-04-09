FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .
COPY ./.env.production ./.env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]