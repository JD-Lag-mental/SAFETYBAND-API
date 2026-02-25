# 🔐 SafetyBand API

Una API REST robusta para sistemas de pago digitales mediante pulseras NFC. Permite gestión de usuarios, wallets, transacciones y autenticación segura.

**🌐 En vivo:** https://safetyband-api.onrender.com

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

---

## ✨ Características

- ✅ **Autenticación JWT** - Seguridad basada en tokens
- ✅ **Gestión de Usuarios** - Roles (Admin, Parent, Student)
- ✅ **Sistema de Wallets** - Balance y movimientos de dinero
- ✅ **Transacciones** - Débitos y créditos con auditoría
- ✅ **Integración NFC** - Preparada para pulseras NFC
- ✅ **Base de datos PostgreSQL** - Datos persistentes y seguros
- ✅ **Validación de datos** - Esquemas de validación robustos
- ✅ **CORS habilitado** - Acceso desde cualquier frontend

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Node.js** | 20+ | Runtime JavaScript |
| **Express** | 4.x | Framework REST API |
| **PostgreSQL** | 16 | Base de datos |
| **Prisma** | 5.x | ORM y migraciones |
| **JWT** | - | Autenticación |
| **Docker** | - | Contenedorización |
| **Render** | - | Deployment en producción |

---

## 📋 Requisitos

- Node.js 20+
- npm o yarn
- PostgreSQL 13+ (para desarrollo local)
- Docker (opcional, para desarrollo con contenedores)

---

## 🚀 Instalación

### Clonación del repositorio

```bash
git clone https://github.com/JD-Lag-mental/SAFETYBAND-API.git
cd SAFETYBAND-API
```

### Instalación de dependencias

```bash
npm install
```

### Configuración de variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safetyband"
NODE_ENV=development
PORT=3000
JWT_SECRET="tu-clave-secreta-aqui"
```

### Sincronización de base de datos

```bash
# Crear/actualizar esquema
npx prisma db push

# Generar Prisma Client
npm run generate
```

### Inicio del servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 🐳 Desarrollo con Docker

### Usando Docker Compose

```bash
docker-compose up
```

Esto inicia:
- PostgreSQL en puerto 5432
- API en puerto 3000

### Detener contenedores

```bash
docker-compose down
```

---

## ⚙️ Configuración

### Base de datos - Render.com

La BD está alojada en Render con:
- **Host**: `dpg-d6f8d2hr0fns73f5cg6g-a.oregon-postgres.render.com`
- **Base**: `safetyband_db`
- **Usuario**: `safetyband_db_user`

### Migraciones

```bash
# Crear nueva migración
npm run migrate

# Aplicar migraciones en producción
npm run migrate:deploy

# Resolver conflictos de migración
npm run migrate:resolve
```

---

## 📁 Estructura del Proyecto

```
safetyband-api/
├── prisma/
│   ├── schema.prisma          # Esquema de BD
│   └── migrations/            # Historial de cambios
├── src/
│   ├── config/
│   │   └── prisma.js          # Configuración de Prisma
│   ├── controllers/           # Lógica de API
│   │   ├── auth.controller.js
│   │   └── wallet.controller.js
│   ├── middlewares/           # Middleware Express
│   │   ├── auth.middleware.js
│   │   └── authorize.middleware.js
│   ├── routes/                # Definición de rutas
│   │   ├── auth.routes.js
│   │   └── wallet.routes.js
│   ├── schemas/               # Validación de datos
│   │   └── validation.js
│   └── services/              # Lógica de negocio
│       └── auth.service.js
├── docs/
│   └── PRODUCTION_ENV.sh      # Variables de producción
├── server.js                  # Punto de entrada
├── package.json               # Dependencias
├── Dockerfile                 # Imagen Docker
├── docker-compose.yml         # Stack Docker local
├── render.yaml                # Configuración Render
└── README.md                  # Este archivo
```

---

## 🔗 API Endpoints

### Autenticación

```
POST /api/auth/register
POST /api/auth/login
```

### Wallets

```
GET /api/wallet/balance       # Obtener balance del usuario
POST /api/wallet/transfer     # Transferir dinero
GET /api/wallet/transactions  # Historial de transacciones
```

### Documentación completa

Para más detalles sobre cada endpoint, ver `src/routes/`

---

## 🌐 Deployment en Render

### Estado actual

✅ **Desplegado en producción**
- **URL**: https://safetyband-api.onrender.com
- **Base de datos**: PostgreSQL en Render
- **Auto-deploy**: Activado desde GitHub

### Pasos para desplegar cambios

1. Hacer cambios en el código local
2. Hacer `git push` a `main`
3. Render detecta cambios automáticamente
4. Auto-deploy inicia en 1-2 minutos
5. API actualizada en vivo

### Verificar deployment

```bash
# Desde terminal
curl https://safetyband-api.onrender.com

# O desde navegador
https://safetyband-api.onrender.com/api/auth/register
```

---

## 🔐 Variables de Entorno

### Desarrollo (`.env`)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safetyband"
DIRECT_DATABASE_URL=""
NODE_ENV=development
PORT=3000
JWT_SECRET="clave-de-desarrollo"
```

### Producción (Render Dashboard)

```env
DATABASE_URL="postgresql://user:password@host.render.com/db?schema=public"
DIRECT_DATABASE_URL="postgresql://user:password@host.render.com/db?schema=public"
NODE_ENV=production
PORT=3000
JWT_SECRET="clave-segura-de-produccion"
```

⚠️ **Nunca** commitar `.env` a Git. Usar `.env.example` como referencia.

---

## 📊 Modelos de Datos

### User
- `id` - UUID único
- `name` - Nombre del usuario
- `email` - Email único
- `password` - Hash bcrypt
- `role` - ADMIN, PARENT, STUDENT
- `parentId` - Referencia a padre (si es estudiante)

### Wallet
- `id` - UUID único
- `userId` - Referencia a User
- `balance` - Saldo actual
- `transactions` - Historial

### Transaction
- `id` - UUID único
- `walletId` - Referencia a Wallet
- `type` - CREDIT o DEBIT
- `amount` - Monto
- `timestamp` - Fecha/hora

---

## 🔧 Scripts disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm start            # Inicia servidor
npm run build        # Genera Prisma Client
npm run generate     # Genera Prisma Client
npm run migrate      # Nueva migración interactiva
npm run migrate:deploy  # Aplica migraciones
```

---

## 📝 Flujo de trabajo

1. **Desarrollo local**
   ```bash
   git checkout -b feature/nueva-caracteristica
   npm run dev
   # ... hacer cambios ...
   git add .
   git commit -m "feat: descripción"
   git push
   ```

2. **Pull Request**
   - Hacer PR en GitHub
   - Revisar cambios
   - Merge a `main`

3. **Deploy automático**
   - Render detecta cambios
   - Ejecuta `npm install && npm run build`
   - Inicia `npm start`
   - API actualizada en vivo

---

## 🐛 Troubleshooting

### Error de conexión a BD

```
Error: P1001: Can't reach database server
```

**Solución:**
- Verificar URL de conexión en `.env`
- Asegurar que PostgreSQL está corriendo
- Verificar credenciales

### Puerta 5432 en uso

```bash
# Liberar puerto (Linux/Mac)
lsof -ti:5432 | xargs kill -9

# O usar docker-compose
docker-compose down
```

### Errores de Prisma

```bash
# Limpiar base de datos (desarrollo únicamente)
npx prisma migrate reset

# Sincronizar esquema
npx prisma db push
```

---

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📜 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Contacto

**Autor**: JD-Lag-mental  
**Email**: contacto@example.com  
**GitHub**: https://github.com/JD-Lag-mental

---

**Última actualización**: Febrero 24, 2026

🎉 **¡Gracias por usar SafetyBand API!**
