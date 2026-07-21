#!/bin/sh

cd /app

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Arquivo .env criado a partir de .env.example"
fi

if [ ! -d "node_modules" ]; then
    npm install
fi

npx sequelize db:migrate

npm run dev