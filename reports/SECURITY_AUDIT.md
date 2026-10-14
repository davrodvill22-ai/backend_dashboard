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

### ⚠️ Node.js Express NODE_ENV Development Mode
- **Severidad:** **Media (`medium`)**
- **Clasificación:** CWE-209 (Generation of Error Message Containing Sensitive Information)
- **Plantilla:** `http/misconfiguration/node-express-dev-env.yaml`
- **Detalle de la vulnerabilidad:**
  Al enviar un cuerpo de petición JSON malformado a la raíz de la API, el servidor respondió con un error HTTP 400 exponiendo el rastreo de pila interno (*stack trace*) del servidor:
  ```html
  <pre>SyntaxError: Unexpected token t in JSON at position 0
      at JSON.parse (<anonymous>)
      at createStrictSyntaxError (/app/node_modules/body-parser/lib/types/json.js:137:10)
      at parse (/app/node_modules/body-parser/lib/types/json.js:86:15)
      at /app/node_modules/body-parser/lib/read.js:162:18...
  </pre>
  ```
- **Riesgo:**
  La exposición de trazas de ejecución y rutas absolutas del sistema de archivos (`/app/node_modules/...`) revela la arquitectura interna, versiones de dependencias y facilita la elaboración de exploits dirigidos por parte de un atacante. Además, se detectó la cabecera `X-Powered-By: Express`.

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
