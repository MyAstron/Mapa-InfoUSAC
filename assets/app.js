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
            description: "Facultad de Ingeniería",
            walkingTime: "6 min",
            visible: true
        },
        {
            id: 2,
            name: "Iglú",
            buildingCode: "Iglú",
            location: { lat: 14.585995536934064, lng: -90.55343753777946 },
            description: "Plaza Central / Área Estudiantil",
            walkingTime: "7 min",
            visible: false
        },
        {
            id: 3,
            name: "Arquitectura (T2)",
            buildingCode: "T2",
            location: { lat: 14.588564113802146, lng: -90.55267019148421 },
            description: "Facultad de Arquitectura",
            walkingTime: "4 min",
            visible: true
        },
        {
            id: 4,
            name: "Odontología (M4)",
            buildingCode: "M4",
            location: { lat: 14.587934621852428, lng: -90.54911038942205 },
            description: "Facultad de Odontología",
            walkingTime: "5 min",
            visible: true
        },
        {
            id: 5,
            name: "Escuela de Ciencia Política (M5)",
            buildingCode: "M5",
            location: { lat: 14.58759078030367, lng: -90.55040634330211 },
            description: "Edificio M-5",
            walkingTime: "3 min",
            visible: true
        },
        {
            id: 6,
            name: "S-4",
            buildingCode: "S4",
            location: { lat: 14.586832424250957, lng: -90.55076631075259 },
            description: "Salones y Aulas S-4",
            walkingTime: "5 min",
            visible: true
        },
        {
            id: 7,
            name: "Ciencias Económicas (S8, 109)",
            buildingCode: "S8",
            location: { lat: 14.586208371908686, lng: -90.54987009142148 },
            description: "Edificio S-8, salon 109",
            walkingTime: "7 min",
            visible: true
        },
        {
            id: 8,
            name: "Derecho (S7)",
            buildingCode: "S7",
            location: { lat: 14.586204011811052, lng: -90.5502677026757 },
            description: "Edificio S-7",
            walkingTime: "7 min",
            visible: true
        }
    ],
    tourSpots: [
        {
            id: 'sun',
            name: "SUN / Biblioteca / Enfermería",
            buildingCode: "SUN",
            location: { lat: 14.586964160055231, lng: -90.55209441363546 },
            completed: false,
            info: "Aquí puedes realizar trámites de salud, biblioteca y exámenes de ubicación."
        },
        {
            id: 'bienestar',
            name: "Bienestar Estudiantil",
            buildingCode: "B.E",
            location: { lat: 14.58720002994269, lng: -90.55072724583526 },
            completed: false,
            info: "Encargado de becas, apoyo psicopedagógico y programas deportivos."
        },
        {
            id: 'rye',
            name: "RYE (Registro) / DIGA",
            buildingCode: "RYE",
            location: { lat: 14.588048349592093, lng: -90.55072829187868 },
            completed: false,
            info: "Trámites de inscripción, certificaciones y carnés universitarios."
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
let globalOrigin = 'default'; // 'default' or 'user'

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

    // Colocar marcadores permanentes
    const sunSpot = CONFIG.tourSpots.find(s => s.id === 'sun');
    if (sunSpot) {
        createCustomMarker(sunSpot.location, sunSpot.buildingCode, sunSpot.name);
    }

    // Marcador permanente de Plaza de las Banderas (P.B.)
    createCustomMarker(CONFIG.startLocation, "P.B.", "Plaza las Banderas");
}

function tryToGetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (currentMode === 'recorridos') {
                    checkTourProgress();
                } else if (currentMode === 'auditorios' && globalOrigin === 'user') {
                    refreshCurrentRoute();
                }
            },
            () => console.log("Error al obtener ubicación técnica."),
            { enableHighAccuracy: true }
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
        // Solo renderizar si es visible
        if (dest.visible === false) return;

        const li = document.createElement('li');
        li.className = 'destination-item';
        li.dataset.id = dest.id;
        li.innerHTML = `
            <div class="dest-title">
                <h3>${dest.name}</h3>
                <span class="walking-time">${dest.walkingTime}</span>
            </div>
            <p>${dest.description}</p>
        `;
        li.addEventListener('click', () => {
            const origin = globalOrigin === 'default' ? CONFIG.startLocation : userLocation;
            const originName = globalOrigin === 'default' ? "Plaza las Banderas" : "Tú";
            calculateAndDisplayRoute(origin, dest, originName);
            updateActiveState(li);
        });
        list.appendChild(li);

        const option = document.createElement('option');
        option.value = dest.id;
        option.textContent = `${dest.name} (${dest.walkingTime})`;
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
            <div class="checklist-main">
                <input type="checkbox" ${spot.completed ? 'checked' : ''}>
                <span>${spot.name}</span>
            </div>
            <div class="info-wrapper">
                <button class="tour-info-btn" title="Más información">(!)</button>
                <div class="tour-tooltip">${spot.info}</div>
            </div>
        `;

        li.addEventListener('click', (e) => {
            const checkbox = li.querySelector('input');
            const infoBtn = li.querySelector('.tour-info-btn');
            const tooltip = li.querySelector('.tour-tooltip');

            // Si se hace clic en el botón de info o en el tooltip, no marcar checkbox
            if (e.target === infoBtn || tooltip.contains(e.target)) {
                return;
            }

            if (e.target.tagName !== 'INPUT') {
                checkbox.checked = !checkbox.checked;
            }

            spot.completed = checkbox.checked;
            li.classList.toggle('completed', spot.completed);
            checkTourProgress();
        });

        const infoBtn = li.querySelector('.tour-info-btn');
        const tooltip = li.querySelector('.tour-tooltip');

        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Cerrar otros tooltips primero
                document.querySelectorAll('.tour-tooltip').forEach(t => {
                    if (t !== tooltip) t.classList.remove('visible');
                });
                tooltip.classList.toggle('visible');
            });
        }

        list.appendChild(li);
    });

    // Cerrar tooltips al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.info-wrapper')) {
            document.querySelectorAll('.tour-tooltip').forEach(t => t.classList.remove('visible'));
        }
    });
}

function checkTourProgress() {
    // Auto-check si el usuario está cerca de algún punto (umbral aprox 30m)
    const PROXIMITY_THRESHOLD = 0.0003;
    let changed = false;

    CONFIG.tourSpots.forEach(spot => {
        if (!spot.completed) {
            const distance = getDist(userLocation, spot.location);
            if (distance < PROXIMITY_THRESHOLD) {
                spot.completed = true;
                changed = true;
                console.log(`Auto-marcado: ${spot.name}`);
            }
        }
    });

    if (changed) {
        renderTourList();
    }

    const pending = CONFIG.tourSpots.filter(s => !s.completed);
    const allDone = pending.length === 0;

    document.getElementById('tour-final').classList.toggle('hidden', !allDone);

    if (!allDone) {
        // Sugerir el más cercano de los pendientes
        // Siempre usamos userLocation para buscar el "más cercano", 
        // pero el origen de la ruta respetará el selector global si es necesario.
        const nearest = findNearest(userLocation, pending);
        if (nearest) {
            const origin = globalOrigin === 'default' ? CONFIG.startLocation : userLocation;
            const originName = globalOrigin === 'default' ? "P.B." : "Tú";
            calculateAndDisplayRoute(origin, nearest, originName);
        }
    } else {
        // Si todo está completo, volver a Plaza las Banderas
        // Si ya estamos en Plaza las Banderas (default origin), no hace falta mostrar ruta DE Plaza las Banderas A Plaza las Banderas
        const origin = globalOrigin === 'default' ? CONFIG.startLocation : userLocation;
        const originName = globalOrigin === 'default' ? "P.B." : "Tú";

        if (globalOrigin === 'user') {
            calculateAndDisplayRoute(userLocation, {
                location: CONFIG.startLocation,
                buildingCode: "P.B",
                name: "Plaza las Banderas"
            }, "Tú");
        } else {
            clearMap();
            createCustomMarker(CONFIG.startLocation, "P.B.", "Plaza las Banderas");
        }
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
                const origin = globalOrigin === 'default' ? CONFIG.startLocation : userLocation;
                const originName = globalOrigin === 'default' ? "Plaza las Banderas" : "Tú";
                calculateAndDisplayRoute(origin, dest, originName);
                updateActiveState(e.target.value);
            }
        });
    }

    // Origin Selector Listeners
    document.getElementById('btn-origin-default').addEventListener('click', () => {
        globalOrigin = 'default';
        document.getElementById('btn-origin-default').classList.add('active');
        document.getElementById('btn-origin-user').classList.remove('active');

        if (currentMode === 'auditorios') {
            refreshCurrentRoute();
        } else {
            checkTourProgress();
        }
    });

    document.getElementById('btn-origin-user').addEventListener('click', () => {
        globalOrigin = 'user';
        document.getElementById('btn-origin-user').classList.add('active');
        document.getElementById('btn-origin-default').classList.remove('active');
        tryToGetLocation(); // Asegurar que tenemos GPS

        if (currentMode === 'auditorios') {
            refreshCurrentRoute();
        } else {
            checkTourProgress();
        }
    });
}

function refreshCurrentRoute() {
    const activeItem = document.querySelector('.destination-item.active');
    const select = document.getElementById('destination-select');
    let destId = null;

    if (activeItem) {
        destId = activeItem.dataset.id;
    } else if (select && select.value) {
        destId = select.value;
    }

    if (destId) {
        const dest = CONFIG.destinations.find(d => d.id == destId);
        const origin = globalOrigin === 'default' ? CONFIG.startLocation : userLocation;
        const originName = globalOrigin === 'default' ? "Plaza las Banderas" : "Tú";
        calculateAndDisplayRoute(origin, dest, originName);
    }
}
