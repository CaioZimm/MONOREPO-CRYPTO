FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]