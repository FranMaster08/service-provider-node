
### **Pasos para encontrar el Tenant ID:**

1. **Selecciona "Microsoft Entra ID":**
   - En la sección de servicios que aparece en tu captura, haz clic en **Microsoft Entra ID** (que es el nuevo nombre de Azure Active Directory).

2. **Accede a la sección "Propiedades":**
   - Una vez dentro de **Microsoft Entra ID**, en el menú lateral izquierdo, busca y haz clic en **Propiedades**.

3. **Busca el campo "ID de directorio (Tenant ID)":**
   - En la página de propiedades, deberías ver un campo llamado **ID de directorio (Tenant ID)**. Este será un valor alfanumérico, similar a:
     ```
     12345678-abcd-1234-efgh-56789abcdef0
     ```

4. **Copia este Tenant ID:**
   - Usa el botón de copiar junto al campo para asegurarte de no cometer errores.

5. **Reemplaza `<TU_TENANT_ID>` en tu código:**
   - Usa este Tenant ID en la configuración de tu aplicación Node.js, específicamente en el campo `entryPoint`:
     ```javascript
     entryPoint: 'https://login.microsoftonline.com/[TENANT_ID]/saml2'
     ```

Perfecto, Francisco. Usando **Homebrew** en tu Mac, puedes instalar **OpenSSL** y generar el certificado de manera rápida. Aquí tienes el paso a paso:

---

### **1. Instalar OpenSSL con Homebrew**
Si aún no tienes **OpenSSL** instalado, sigue estos pasos:

1. Abre tu terminal.
2. Ejecuta el siguiente comando para instalar OpenSSL:
   ```bash
   brew install openssl
   ```
3. Una vez instalado, verifica la versión:
   ```bash
   openssl version
   ```
   Deberías ver algo como `OpenSSL 1.x.x`.

---

### **2. Generar un Certificado con OpenSSL**
Sigue estos comandos para crear el par de claves (privada y pública):

#### **a) Generar la clave privada (private.key):**
Ejecuta:
```bash
openssl genpkey -algorithm RSA -out private.key -aes256
```
- Esto genera un archivo `private.key` con una clave privada cifrada.
- **Nota:** Durante el proceso, te pedirá que configures una contraseña para proteger la clave privada.

#### **b) Generar el certificado público (public.crt):**
Usa la clave privada para generar el certificado público:
```bash
openssl req -new -x509 -key private.key -out public.crt -days 3650
```
- Durante este paso, se te pedirá completar información para el certificado. Por ejemplo:
  ```
  Country Name (2 letter code) [AU]: CO
  State or Province Name (full name) [Some-State]: Atlántico
  Locality Name (eg, city) []: Barranquilla
  Organization Name (eg, company) [Internet Widgits Pty Ltd]: TuEmpresa
  Organizational Unit Name (eg, section) []: Desarrollo
  Common Name (e.g. server FQDN or YOUR name) []: localhost
  Email Address []: tuemail@ejemplo.com
  ```

- Al finalizar, tendrás un archivo `public.crt` que es tu certificado público.

---

### **3. Verificar el Contenido del Certificado**
Para asegurarte de que todo está correcto, ejecuta:
```bash
openssl x509 -in public.crt -text -noout
```
Esto mostrará los detalles del certificado, incluyendo el emisor, la fecha de vencimiento y las claves públicas.

---

### **4. Usar el Certificado en tu Aplicación**
- **Archivo `private.key`:** Este archivo es **privado** y solo lo usas para firmar las respuestas.
- **Archivo `public.crt`:** Este archivo se comparte y se usa en la configuración SAML de tu aplicación Node.js.

En tu archivo `server.js`, usa el contenido del certificado público:
```javascript
cert: `-----BEGIN CERTIFICATE-----
(PEGA AQUÍ EL CONTENIDO DE public.crt)
-----END CERTIFICATE-----`
```

---

### **5. ¿Qué sigue?**
- Usa `public.crt` como tu certificado público para configurar el flujo SAML en **Azure AD** y en tu aplicación Node.js.
- Si necesitas exponer tu aplicación al público para probar con Azure AD, usa **Ngrok**.

¿Te ayudo a integrar este certificado con Azure AD o tu aplicación? 😊
