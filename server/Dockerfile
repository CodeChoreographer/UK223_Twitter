FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV JWT_SECRET=devsecret123
ENV JWT_EXPIRES_IN=5h

RUN npm run build

CMD ["node", "dist/index.cjs"]
