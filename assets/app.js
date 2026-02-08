/**
 * USAC Guided Map System - Core Logic
 */

// Dynamic Loader for Google Maps API
(function loadGoogleMaps() {
    if (typeof APP_CONFIG === 'undefined' || !APP_CONFIG.googleMapsApiKey) {
        console.error("Error: APP_CONFIG.googleMapsApiKey no encontrado. Revisa config.js.");
        return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${APP_CONFIG.googleMapsApiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
})();

const CONFIG = {
    startLocation: { lat: 14.588530590037978, lng: -90.55140598811853 }, // Rectoría
    destinations: [
        // ... (resto de destinos se mantienen)
        {
            id: 1,
            name: "Auditorio Francisco Vela (T-6)",
            location: { lat: 14.587154601902279, lng: -90.5532238280715 },
            description: "Facultad de Ingeniería"
        },
        {
            id: 2,
            name: "Iglú",
            location: { lat: 14.585995536934064, lng: -90.55343753777946 },
            description: "Plaza Central / Área Estudiantil"
        },
        {
            id: 3,
            name: "Arquitectura (T2)",
            location: { lat: 14.588564113802146, lng: -90.55267019148421 },
            description: "Facultad de Arquitectura"
        },
        {
            id: 4,
            name: "Odontología (M4)",
            location: { lat: 14.587934621852428, lng: -90.54911038942205 },
            description: "Facultad de Odontología"
        },
        {
            id: 5,
            name: "Escuela de Ciencia Política (M5)",
            location: { lat: 14.58759078030367, lng: -90.55040634330211 },
            description: "Edificio M-5"
        },
        {
            id: 6,
            name: "S-4",
            location: { lat: 14.586832424250957, lng: -90.55076631075259 },
            description: "Salones y Aulas S-4"
        },
        {
            id: 7,
            name: "Ciencias Económicas (S8)",
            location: { lat: 14.586208371908686, lng: -90.54987009142148 },
            description: "Edificio S-8"
        }
    ]
};

let map;
let directionsService;
let directionsRenderer;
let currentDestination = null;

function initMap() {
    console.log("Iniciando initMap...");
    // La API Key se asume válida por aprobación técnica previa del usuario.

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: "#003366",
            strokeWeight: 6,
            strokeOpacity: 0.7
        }
    });

    const guatemalaCity = { lat: 14.584, lng: -90.552 }; // Coordenadas aproximadas USAC

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: guatemalaCity,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#7c93a3" }]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });

    directionsRenderer.setMap(map);
    // directionsRenderer.setPanel(document.getElementById("steps-content")); // Desactivado por solicitud

    console.log("Mapa inicializado correctamente (Comercios ocultos).");
    renderDestinationList();
    setupEventListeners();
}

function renderDestinationList() {
    console.log("Renderizando lista y select de destinos...");
    const list = document.getElementById('destination-list');
    const select = document.getElementById('destination-select');
    list.innerHTML = ''; // Limpiar lista previa

    CONFIG.destinations.forEach(dest => {
        // Desktop List
        const li = document.createElement('li');
        li.className = 'destination-item';
        li.dataset.id = dest.id;
        li.innerHTML = `
            <h3>${dest.name}</h3>
            <p>${dest.description}</p>
        `;

        li.addEventListener('click', () => {
            currentDestination = dest.location;
            calculateAndDisplayRoute(currentDestination);
            updateActiveState(li);
        });

        list.appendChild(li);

        // Mobile Select
        const option = document.createElement('option');
        option.value = dest.id;
        option.textContent = dest.name;
        select.appendChild(option);
    });

    console.log("Lista y select de destinos renderizados.");
}

function calculateAndDisplayRoute(destination) {
    console.log("Calculando ruta hacia:", destination);
    if (!destination) {
        console.error("Error: No se proporcionó destino.");
        return;
    }

    directionsService.route(
        {
            origin: CONFIG.startLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING // Por defecto caminata/accesibilidad
        },
        (response, status) => {
            if (status === "OK") {
                console.log("Ruta calculada con éxito.");
                directionsRenderer.setDirections(response);
                document.getElementById('directions-panel').classList.remove('hidden');
                // Mostrar aviso de seguridad
                const safetyWarning = document.getElementById('safety-warning');
                safetyWarning.classList.remove('hidden');
                setTimeout(() => safetyWarning.classList.add('hidden'), 5000); // Ocultar tras 5s
            } else {
                console.error("Error en DirectionsService:", status);
                alert("No se pudo calcular la ruta: " + status);
            }
        }
    );
}

function updateActiveState(elementOrId) {
    const items = document.querySelectorAll('.destination-item');
    items.forEach(item => item.classList.remove('active'));

    if (typeof elementOrId === 'object') {
        elementOrId.classList.add('active');
    } else {
        const item = Array.from(items).find(i => i.dataset.id == elementOrId);
        if (item) item.classList.add('active');
    }
}

function setupEventListeners() {
    document.getElementById('close-panel').addEventListener('click', () => {
        document.getElementById('directions-panel').classList.add('hidden');
    });

    // Mobile Select handling
    const select = document.getElementById('destination-select');
    select.addEventListener('change', (e) => {
        const destId = e.target.value;
        if (!destId) return;

        const dest = CONFIG.destinations.find(d => d.id == destId);
        if (dest) {
            currentDestination = dest.location;
            calculateAndDisplayRoute(currentDestination);
            updateActiveState(destId);
        }
    });
}

// Fallback si la carga asíncrona falla
window.addEventListener('load', () => {
    if (typeof google === 'undefined') {
        renderDestinationList();
    }
});
