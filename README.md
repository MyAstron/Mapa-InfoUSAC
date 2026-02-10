# Mapa Guía Info-USAC 🗺️

Sistema interactivo de rutas universitarias diseñado para el campus central de la Universidad de San Carlos de Guatemala. Optimizado para dispositivos móviles y enfocado en la seguridad y orientación del estudiante sancarlista.

## ✨ Características Principales
- **Doble Modo de Navegación:**
    - **Auditorios:** Rutas fijas desde Plaza las Banderas hacia los principales auditorios con tiempos estimados de caminata.
    - **Recorridos Guided Tour:** Sistema inteligente que detecta tu ubicación y te guía punto a punto por lugares clave (SUN, Bienestar, Registro).
- **Auto-Marcado Inteligente:** En el modo Recorridos, los puntos se completan automáticamente al detectar que estás a menos de 30 metros del objetivo.
- **Enfoque Móvil Premium:** Interfaz adaptativa ultra-compacta con menús inteligentes y tipografía moderna (Outfit).
- **Mapa Limpio y Seguro:** Visualización simplificada sin distracciones externas y avisos de seguridad activos durante la navegación.
- **Privacidad de API:** Sistema de carga dinámica de credenciales con protección contra caché (Cache Busting).

## 📁 Estructura del Código
- `index.html`: Estructura base con selector de modos y contenedores dinámicos.
- `assets/style.css`: Diseño premium, sistema de glassmorphism y adaptabilidad móvil total.
- `assets/app.js`: Lógica core (Carga de Google Maps, Directions API, lógica de proximidad y gestión de estados).
- `assets/config.js`: Archivo privado para la API Key de Google Maps.
- `assets/logo.png`: Identidad visual minimalista.

## 🛠️ Configuración y Seguridad

Para proteger tu cuota de Google Cloud y mantener la navegación funcional:

1. **API Key de Google Maps:**
   - Consigue una llave en [Google Cloud Console](https://console.cloud.google.com/).
   - Habilita **Maps JavaScript API** y **Directions API**.

2. **Configuración Local:**
   - Edita el archivo `assets/config.js`.
   - Coloca tu llave en la variable `googleMapsApiKey`:
     ```javascript
     const APP_CONFIG = {
         googleMapsApiKey: "TU_LLAVE_AQUI"
     };
     ```
   - **Nota:** El archivo `config.js` está excluido vía `.gitignore` por seguridad.

## 🚶 Uso
1. Abre la aplicación en tu navegador.
2. Elige el modo según tu necesidad (**Auditorios** o **Recorridos**).
3. **Auditorios:** Selecciona un destino y verás el tiempo estimado (ej: 3 min) y la ruta desde Plaza las Banderas.
4. **Recorridos:** Permite el acceso a tu ubicación. El sistema te llevará al punto más cercano. Al terminar, usa el botón "Finalizar en Plaza las Banderas" para reiniciar el tour.

---
Diseñado para la comunidad sancarlista por **Info-USAC** @ 2026 Chalecos Cafe.
