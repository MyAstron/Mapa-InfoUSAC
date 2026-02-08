# Mapa Guía Info-USAC 🗺️

Sistema interactivo de rutas universitarias diseñado para el campus central de la Universidad de San Carlos de Guatemala. Optimizado para dispositivos móviles y enfocado en la seguridad del estudiante.

## ✨ Características Principales
- **Enfoque Móvil:** Interfaz adaptativa con menús inteligentes para celulares.
- **Rutas Precisas:** Navegación desde Rectoría hacia facultades y edificios clave.
- **Mapa Limpio:** Visualización simplificada sin distracciones externas (comercios/sitios ajenos).
- **Seguridad Primero:** Aviso de precaución activo durante la navegación.
- **Privacidad de API:** Sistema de carga dinámica de credenciales.

## 🛠️ Configuración y Seguridad

Para proteger tu cuota de Google Cloud y mantener la clave segura, el sistema utiliza un archivo separado:

1. **API Key de Google Maps:**
   - Consigue una llave en [Google Cloud Console](https://console.cloud.google.com/).
   - Asegúrate de habilitar **Maps JavaScript API**.

2. **Configuración Local:**
   - Crea o abre el archivo `config.js` en la raíz del proyecto.
   - Pega tu llave en la variable `googleMapsApiKey`:
     ```javascript
     const APP_CONFIG = {
         googleMapsApiKey: "TU_LLAVE_AQUI"
     };
     ```
   - **Nota:** El archivo `config.js` está incluido en `.gitignore` para que no lo subas accidentalmente a repositorios públicos.

3. **Restricciones Recomendadas:**
   - En Google Cloud Console, restringe tu API Key para que solo funcione en tu dominio o IP (`HTTP Referrers`).

## 📁 Estructura
- `index.html`: Base visual y contenedores de UI.
- `style.css`: Diseño premium, animaciones y responsive móvil.
- `app.js`: Cerebro del sistema (Carga de mapa, rutas y lógica de seguridad).
- `config.js`: Almacén privado de credenciales.

## 🚶 Uso
1. Abre `index.html` en tu navegador.
2. Selecciona tu destino (desde el menú superior en móvil o la lista en PC).
3. Sigue la línea azul en el mapa. **¡Camina con cuidado!**

---
Diseñado para la comunidad sancarlista por **Info-USAC**.
