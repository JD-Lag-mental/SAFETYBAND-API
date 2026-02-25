FROM node:20-alpine

# Instalar openssl, postgresql-client y otros dependencias necesarias
RUN apk add --no-cache openssl postgresql-client

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Ejecutar migraciones y el servidor
CMD ["sh", "-c", "npx prisma db push --skip-generate && node server.js"]

EXPOSE 3000
