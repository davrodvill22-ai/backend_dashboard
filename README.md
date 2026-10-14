# 🍔 Backend Burger API

Servicio Backend REST desarrollado en **Node.js** con **Express** para la gestión y listado de hamburguesas. Implementa autenticación mediante **Bearer Token (JWT)** obtenido del servicio LDAP / Keycloak.

## 🚀 Características
- **Listado de Hamburguesas (`GET /api/burgers`)**: Requiere Bearer Token.
- **Creación de Hamburguesas (`POST /api/burgers`)**: Requiere Bearer Token y valida que los campos requeridos (`name`, `description`, `price`) estén presentes.
- **Middleware de Autenticación**: Valida la existencia y formato del JWT enviado en el header `Authorization: Bearer <token>`.
- **Dockerizado**: Incluye `Dockerfile` listo para despliegue en contenedores.

---

## 📋 Requisitos
- Node.js (v18 o superior) o Docker
- npm

---

## ⚙️ Instalación y Uso Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   PORT=3001
   JWT_SECRET=tu_secreto_ldap_jwt_aqui
   ```

3. Iniciar el servidor:
   ```bash
   npm start
   ```
   El servidor estará disponible en `http://localhost:3001`.

---

## 🐳 Despliegue con Docker

Construir y levantar la imagen Docker:
```bash
docker build -t backend-burger-api .
docker run -d -p 3001:3001 --name backend-burger-api backend-burger-api
```

---

## 🛡️ Endpoints y Autenticación

Todas las rutas bajo `/api/` requieren el header:
```http
Authorization: Bearer <JWT_TOKEN>
```

| Método | Endpoint | Descripción | Body (JSON) |
|---|---|---|---|
| `GET` | `/api/burgers` | Obtiene la lista completa de hamburguesas | N/A |
| `POST` | `/api/burgers` | Registra una nueva hamburguesa | `{"name": "...", "description": "...", "price": 150}` |
