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
    startLocation: { lat: 14.588530590037978, lng: -90.55140598811853 }, // Rectoría / Plaza de las Banderas
    destinations: [
        {
            id: 1,
            name: "Auditorio Francisco Vela (T6)",
            buildingCode: "T6",
            location: { lat: 14.587154601902279, lng: -90.5532238280715 },
            description: "Facultad de Ingeniería"
        },
        {
            id: 2,
            name: "Iglú",
            buildingCode: "Iglú",
            location: { lat: 14.585995536934064, lng: -90.55343753777946 },
            description: "Plaza Central / Área Estudiantil"
        },
        {
            id: 3,
            name: "Arquitectura (T2)",
            buildingCode: "T2",
            location: { lat: 14.588564113802146, lng: -90.55267019148421 },
            description: "Facultad de Arquitectura"
        },
        {
            id: 4,
            name: "Odontología (M4)",
            buildingCode: "M4",
            location: { lat: 14.587934621852428, lng: -90.54911038942205 },
            description: "Facultad de Odontología"
        },
        {
            id: 5,
            name: "Escuela de Ciencia Política (M5)",
            buildingCode: "M5",
            location: { lat: 14.58759078030367, lng: -90.55040634330211 },
            description: "Edificio M-5"
        },
        {
            id: 6,
            name: "S-4",
            buildingCode: "S4",
            location: { lat: 14.586832424250957, lng: -90.55076631075259 },
            description: "Salones y Aulas S-4"
        },
        {
            id: 7,
            name: "Ciencias Económicas (S8)",
            buildingCode: "S8",
            location: { lat: 14.586208371908686, lng: -90.54987009142148 },
            description: "Edificio S-8"
        }
    ],
    tourSpots: [
        {
            id: 'sun',
            name: "SUN / Biblioteca / Enfermería",
            buildingCode: "SUN",
            location: { lat: 14.586964160055231, lng: -90.55209441363546 },
            completed: false
        },
        {
            id: 'bienestar',
            name: "Bienestar Estudiantil",
            buildingCode: "B.E",
            location: { lat: 14.58720002994269, lng: -90.55072724583526 },
            completed: false
        },
        {
            id: 'rye',
            name: "RYE (Registro) / DIGA",
            buildingCode: "RYE",
            location: { lat: 14.588048349592093, lng: -90.55072829187868 },
            completed: false
        }
    ]
};

let map;
let directionsService;
let directionsRenderer;
let startMarker;
let endMarker;
let userLocation = CONFIG.startLocation;
let currentMode = 'auditorios';

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: "#003366",
            strokeWeight: 6,
            strokeOpacity: 0.7
        }
    });

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: CONFIG.startLocation,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
            { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }
        ]
    });

    directionsRenderer.setMap(map);
    renderDestinationList();
    renderTourList();
    setupEventListeners();
}

function tryToGetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (currentMode === 'recorridos') {
                    checkTourProgress(); // Recalcular al obtener ubicación si estamos en tour
                }
            },
            () => console.log("Permiso de ubicación denegado.")
        );
    }
}

function createCustomMarker(position, label, title) {
    return new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        label: { text: label, color: "white", fontSize: "12px", fontWeight: "bold" },
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#003366",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 15
        }
    });
}

function renderDestinationList() {
    const list = document.getElementById('destination-list');
    const select = document.getElementById('destination-select');
    if (!list || !select) return;

    list.innerHTML = '';
    select.innerHTML = '<option value="">-- Selecciona un destino --</option>';

    CONFIG.destinations.forEach(dest => {
        const li = document.createElement('li');
        li.className = 'destination-item';
        li.dataset.id = dest.id;
        li.innerHTML = `<h3>${dest.name}</h3><p>${dest.description}</p>`;
        li.addEventListener('click', () => {
            // Auditorio: Origen fijo Plaza las Banderas
            calculateAndDisplayRoute(CONFIG.startLocation, dest, "Plaza las Banderas");
            updateActiveState(li);
        });
        list.appendChild(li);

        const option = document.createElement('option');
        option.value = dest.id;
        option.textContent = dest.name;
        select.appendChild(option);
    });
}

function renderTourList() {
    const list = document.getElementById('tour-checklist');
    if (!list) return;
    list.innerHTML = '';

    CONFIG.tourSpots.forEach(spot => {
        const li = document.createElement('li');
        li.className = `checklist-item ${spot.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${spot.completed ? 'checked' : ''}>
            <span>${spot.name}</span>
        `;

        li.addEventListener('click', (e) => {
            const checkbox = li.querySelector('input');
            if (e.target.tagName !== 'INPUT') {
                checkbox.checked = !checkbox.checked;
            }
            spot.completed = checkbox.checked;
            li.classList.toggle('completed', spot.completed);
            checkTourProgress();
        });

        list.appendChild(li);
    });
}

function checkTourProgress() {
    const pending = CONFIG.tourSpots.filter(s => !s.completed);
    const allDone = pending.length === 0;

    document.getElementById('tour-final').classList.toggle('hidden', !allDone);

    if (!allDone) {
        // Sugerir el más cercano de los pendientes usando userLocation
        const nearest = findNearest(userLocation, pending);
        if (nearest) {
            calculateAndDisplayRoute(userLocation, nearest, "Tú");
        }
    } else {
        // Si todo está completo, mostrar ruta a Plaza las Banderas
        calculateAndDisplayRoute(userLocation, {
            location: CONFIG.startLocation,
            buildingCode: "P.B",
            name: "Plaza las Banderas"
        }, "Tú");
    }
}

function findNearest(origin, points) {
    if (points.length === 0) return null;
    return points.reduce((prev, curr) => {
        const distPrev = getDist(origin, prev.location);
        const distCurr = getDist(origin, curr.location);
        return distPrev < distCurr ? prev : curr;
    });
}

function getDist(p1, p2) {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
}

function calculateAndDisplayRoute(origin, destInfo, originName) {
    if (!destInfo) return;



    directionsService.route(
        {
            origin: origin,
            destination: destInfo.location,
            travelMode: google.maps.TravelMode.WALKING
        },
        (response, status) => {
            if (status === "OK") {
                clearMap();
                directionsRenderer.setDirections(response);
                startMarker = createCustomMarker(origin, originName === "Tú" ? "Tú" : "P.B.", originName);
                endMarker = createCustomMarker(destInfo.location, destInfo.buildingCode, destInfo.name);

                const safetyWarning = document.getElementById('safety-warning');
                safetyWarning.classList.remove('hidden');
                setTimeout(() => safetyWarning.classList.add('hidden'), 5000);
            } else {
                console.error("Fallo de ruta:", status);
                if (status !== "OK" && originName === "Tú") {
                    calculateAndDisplayRoute(CONFIG.startLocation, destInfo, "P.B.");
                }
            }
        }
    );
}

function clearMap() {
    if (startMarker) startMarker.setMap(null);
    if (endMarker) endMarker.setMap(null);
    directionsRenderer.setDirections({ routes: [] });
}

function resetTour() {
    // Recargar la página para limpiar todo el estado y evitar errores en el mapa
    location.reload();
}

function updateActiveState(elementOrId) {
    document.querySelectorAll('.destination-item').forEach(item => item.classList.remove('active'));
    if (typeof elementOrId === 'object') {
        elementOrId.classList.add('active');
    } else {
        const item = Array.from(document.querySelectorAll('.destination-item')).find(i => i.dataset.id == elementOrId);
        if (item) item.classList.add('active');
    }
}

function setupEventListeners() {
    document.getElementById('btn-auditorios').addEventListener('click', () => {
        currentMode = 'auditorios';
        document.getElementById('btn-auditorios').classList.add('active');
        document.getElementById('btn-recorridos').classList.remove('active');
        document.getElementById('section-auditorios').classList.remove('hidden');
        document.getElementById('section-recorridos').classList.add('hidden');
        clearMap();
    });

    document.getElementById('btn-recorridos').addEventListener('click', () => {
        currentMode = 'recorridos';
        document.getElementById('btn-recorridos').classList.add('active');
        document.getElementById('btn-auditorios').classList.remove('active');
        document.getElementById('section-recorridos').classList.remove('hidden');
        document.getElementById('section-auditorios').classList.add('hidden');
        tryToGetLocation(); // Solo consultar ubicación al entrar a recorridos
        checkTourProgress();
    });

    document.getElementById('btn-return-pb').addEventListener('click', () => {
        resetTour();
    });

    const select = document.getElementById('destination-select');
    if (select) {
        select.addEventListener('change', (e) => {
            const dest = CONFIG.destinations.find(d => d.id == e.target.value);
            if (dest) {
                calculateAndDisplayRoute(CONFIG.startLocation, dest, "Plaza las Banderas");
                updateActiveState(e.target.value);
            }
        });
    }
}
