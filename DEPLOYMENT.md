# 🚀 Guía de Despliegue

Esta guía explica cómo desplegar SafetyBand en producción.

## Arquitectura de Despliegue

```
┌─────────────────┐
│  Vercel (Client)│  Frontend React
├─────────────────┤
│  Render (API)   │  Backend Node.js
├─────────────────┤
│  Render (BD)    │  PostgreSQL
└─────────────────┘
```

---

## Backend API - Render.com

✅ **Ya desplegado**

### Verificar estado

URL: https://safetyband-api.onrender.com

```bash
curl https://safetyband-api.onrender.com/api/auth/register
```

### Variables de entorno en Render

Configura en Render Dashboard → Settings → Environment:

```
DATABASE_URL=postgresql://...
NODE_ENV=production
JWT_SECRET=tu-clave-secreta
PORT=3000
```

### Re-desplegar cambios

```bash
git push
# Render detecta cambios automáticamente y redeploya
```

---

## Frontend Client - Vercel

### Opción 1: Despliegue automático (Recomendado)

#### Paso 1: Conectar GitHub a Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio
3. Vercel te detectará automáticamente que es un Vite project

#### Paso 2: Configurar

Al crear el proyecto:

- **Framework**: Vite
- **Root Directory**: `client/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Paso 3: Variables de entorno

En Settings → Environment Variables, agrega:

```
VITE_API_URL=https://safetyband-api.onrender.com
```

#### Paso 4: Deploy

¡Hecho! Vercel desplegará automáticamente en:
```
https://safetyband-client.vercel.app
```

Cada `git push` a `main` redesplegará automáticamente.

---

### Opción 2: Despliegue manual con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
cd client
vercel

# Production
vercel --prod
```

---

## Base de Datos - Render

✅ **Ya desplegada**

### Conexión

- **Host**: dpg-d6f8d2hr0fns73f5cg6g-a.oregon-postgres.render.com
- **Database**: safetyband_db
- **User**: safetyband_db_user

### Verificar estado

En Render Dashboard → Databases → safetyband_db

Debe estar "Available" (verde).

---

## URLs Finales

Una vez desplegado:

- 🌐 **Frontend**: https://safetyband-client.vercel.app
- 🔌 **API**: https://safetyband-api.onrender.com
- 🗄️ **Base de Datos**: Manejada por Render internamente

---

## Checklist Despliegue

- [ ] API en Render corriendo
- [ ] BD en Render Available
- [ ] Repositorio GitHub sincronizado
- [ ] Cliente conectado a Vercel
- [ ] Variables de entorno configuradas
- [ ] `VITE_API_URL` apunta a API correcta
- [ ] JWT_SECRET configurado en Render
- [ ] Build sin errores
- [ ] Endpoints funcionan en producción

---

## Troubleshooting Despliegue

### "Cannot connect to database"
- Verificar `DATABASE_URL` en Render
- Verificar que BD está "Available"
- Verificar credenciales

### "Build failed on Vercel"
- Ver logs en Vercel Dashboard
- Ejecutar `npm run build` localmente
- Verificar `package.json` tiene dependencias

### "CORS error en frontend"
- Verificar `VITE_API_URL` en Vercel env vars
- Verificar que API tiene CORS habilitado
- Revisar console del navegador

### "JWT authentication failing"
- Verificar `JWT_SECRET` es igual en Render
- Verificar token en localStorage
- Revisar logs de Render

---

## Logs y Debugging

### Ver logs de Render (API)

```
Render Dashboard → safetyband-api → Logs
```

### Ver logs de Vercel (Frontend)

```
Vercel Dashboard → safetyband-client → Deployments → Logs
```

### Logs locales de BD

```
Render Dashboard → safetyband_db → Logs
```

---

## Performance y Monitoreo

### Render - Web Service

- Gratis con auto-sleep (spin-down)
- $7/mes para always-on
- Logs en tiempo real

### Vercel - Frontend

- Gratis con builds ilimitados
- Edge network global
- Analytics integrado

### Render - PostgreSQL

- Gratis 90 conexiones
- 1GB almacenamiento
- Auto-backup diario

---

## Actualizar código

### Backend

```bash
git add .
git commit -m "fix: actualización"
git push
# Render redeploya automáticamente en 1-2 min
```

### Frontend

```bash
git add .
git commit -m "fix: actualización"
git push
# Vercel redeploya automáticamente en 1-2 min
```

---

## Rollback

### Render API

```
Dashboard → safetyband-api → Deployments → Selecciona versión anterior → Redeploy
```

### Vercel Client

```
Dashboard → Deployments → Opción anterior → Promote to production
```

---

## Próximos pasos

- [ ] Configurar dominio personalizado
- [ ] Habilitar HTTPS (automático en Vercel/Render)
- [ ] Configurar monitoreo/alertas
- [ ] Backups automáticos de BD
- [ ] CI/CD con GitHub Actions

---

**Última actualización**: Febrero 25, 2026

¿Necesitas ayuda? Revisa los logs o consulta la documentación oficial de [Vercel](https://vercel.com/docs) o [Render](https://render.com/docs).
