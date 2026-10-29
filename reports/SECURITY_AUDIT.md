# 🛡️ Informe de Seguridad con Nuclei - Backend Burger API

Este informe recopila los resultados de la auditoría de seguridad automatizada ejecutada con **ProjectDiscovery Nuclei** sobre el contenedor del **Backend API** (`http://backend-burger-api:3001`).

---

## 📋 Resumen del Escaneo
- **Objetivo analizado:** `http://backend-burger-api:3001`
- **Herramienta:** ProjectDiscovery Nuclei v3.11.1
- **Plantillas ejecutadas:** 11,144 plantillas de seguridad
- **Archivo de resultados raw:** [`reports/nuclei-results.jsonl`](./nuclei-results.jsonl)
- **Total de hallazgos:** 1 hallazgo de severidad Media (`medium`)

---

## 🔍 Hallazgo Detectado

### ⚠️ [RESUELTO] Node.js Express NODE_ENV Development Mode
- **Severidad:** **Media (`medium`)** [Mitigada]
- **Clasificación:** CWE-209 (Generation of Error Message Containing Sensitive Information)
- **Plantilla:** `http/misconfiguration/node-express-dev-env.yaml`
- **Estado:** ✅ **Corregido**
- **Acciones aplicadas para la corrección:**
  1. Se agregó `ENV NODE_ENV=production` en el `Dockerfile`.
  2. Se deshabilitó la cabecera `X-Powered-By` mediante `app.disable('x-powered-by')`.
  3. Se implementó un middleware centralizado para el manejo de excepciones y errores de parseo de JSON, devolviendo respuestas JSON estandarizadas sin exponer trazas de ejecución (`stack traces`) ni rutas internas del servidor.

---

## 💡 Recomendaciones de Mitigación

1. **Establecer `NODE_ENV=production`**:
   Configurar la variable de entorno en el `Dockerfile` o en el archivo de despliegue:
   ```dockerfile
   ENV NODE_ENV=production
   ```
   En modo producción, Express suprime automáticamente los stack traces en las respuestas de error hacia el cliente.

2. **Ocultar la cabecera `X-Powered-By`**:
   En el archivo principal de Express (`index.js`):
   ```javascript
   app.disable('x-powered-by');
   ```

3. **Manejador de Errores Centralizado**:
   Implementar un middleware de manejo de errores personalizado que devuelva mensajes JSON genéricos sin detalles internos:
   ```javascript
   app.use((err, req, res, next) => {
     res.status(err.status || 500).json({
       error: 'Ocurrió un error al procesar la solicitud'
     });
   });
   ```
