#!/bin/bash
set -e

echo "Esperando a que PostgreSQL esté listo..."
until PGPASSWORD=postgres psql -h "$DB_HOST" -U postgres -d safetyband -c '\q' 2>/dev/null; do
  echo "PostgreSQL no está listo - reintentando en 3 segundos..."
  sleep 3
done

echo "PostgreSQL está listo!"
echo "Ejecutando migraciones de Prisma..."

npx prisma migrate deploy || npx prisma db push --skip-generate

echo "¡Migraciones completadas!"
echo "Iniciando servidor..."

node server.js
