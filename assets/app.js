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
    startLocation: { lat: 14.588539493011783, lng: -90.55130782710258 }, // Rectoría / Plaza de las Banderas
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
            location: { lat: 14.588092245794074, lng: -90.54916937057705 },
            description: "Facultad de Odontología",
            walkingTime: "5 min",
            visible: true,
            customPath: [
                { lat: 14.58849374167678, lng: -90.55103140486266 },
                { lat: 14.588362430213692, lng: -90.55102688199676 },
                { lat: 14.588229659654715, lng: -90.54998662284339 },
                { lat: 14.588324495776439, lng: -90.54993687131868 },
                { lat: 14.588283361659169, lng: -90.54992520421627 },
                { lat: 14.58833657425039, lng: -90.54989502936131 },
                { lat: 14.588338521052222, lng: -90.54988362997271 },
                { lat: 14.58828401059545, lng: -90.54989435880522 },
                { lat: 14.588180830047763, lng: -90.54932975380375 },
                { lat: 14.588104904709166, lng: -90.5493398120878 }
            ]
        },
        {
            id: 5,
            name: "Escuela de Ciencia Política (M5)",
            buildingCode: "M5",
            location: { lat: 14.58759078030367, lng: -90.55040634330211 },
            description: "Edificio M-5",
            walkingTime: "3 min",
            visible: true,
            customPath: [
                { lat: 14.588233845187478, lng: -90.5513648240447 },
                { lat: 14.588173988410558, lng: -90.55107238033939 },
                { lat: 14.587809286954716, lng: -90.55110657850442 },
                { lat: 14.587741148716548, lng: -90.55100532511163 },
                { lat: 14.58768209555735, lng: -90.5509268705002 },
                { lat: 14.587612659407654, lng: -90.55086585024362 },
                { lat: 14.58755230834387, lng: -90.55079745391207 },
                { lat: 14.587586701962888, lng: -90.55068211892159 },
                { lat: 14.587576967920324, lng: -90.55061104038093 },
                { lat: 14.587510127483016, lng: -90.55052990355624 }
            ]
        },
        {
            id: 6,
            name: "S-4",
            buildingCode: "S4",
            location: { lat: 14.586832424250957, lng: -90.55076631075259 },
            description: "Salones y Aulas S-4",
            walkingTime: "5 min",
            visible: true,
            customPath: [
                { lat: 14.588233845187478, lng: -90.5513648240447 },
                { lat: 14.588173988410558, lng: -90.55107238033939 },
                { lat: 14.587809286954716, lng: -90.55110657850442 },
                { lat: 14.587741148716548, lng: -90.55100532511163 },
                { lat: 14.58768209555735, lng: -90.5509268705002 },
                { lat: 14.587612659407654, lng: -90.55086585024362 },
                { lat: 14.58755230834387, lng: -90.55079745391207 },
                { lat: 14.587586701962888, lng: -90.55068211892159 },
                { lat: 14.587576967920324, lng: -90.55061104038093 },
                { lat: 14.587510127483016, lng: -90.55052990355624 },
                { lat: 14.587436797652476, lng: -90.55051246920286 },
                { lat: 14.586812394639189, lng: -90.55059504167194 }
            ]
        },
        {
            id: 7,
            name: "Ciencias Económicas (S8, 109)",
            buildingCode: "S8",
            location: { lat: 14.586208371908686, lng: -90.54987009142148 },
            description: "Edificio S-8, salon 109",
            walkingTime: "7 min",
            visible: true,
            customPath: [
                { lat: 14.588233845187478, lng: -90.5513648240447 },
                { lat: 14.588173988410558, lng: -90.55107238033939 },
                { lat: 14.587809286954716, lng: -90.55110657850442 },
                { lat: 14.587741148716548, lng: -90.55100532511163 },
                { lat: 14.58768209555735, lng: -90.5509268705002 },
                { lat: 14.587612659407654, lng: -90.55086585024362 },
                { lat: 14.58755230834387, lng: -90.55079745391207 },
                { lat: 14.587586701962888, lng: -90.55068211892159 },
                { lat: 14.587576967920324, lng: -90.55061104038093 },
                { lat: 14.587510127483016, lng: -90.55052990355624 },
                { lat: 14.587436797652476, lng: -90.55051246920286 },
                { lat: 14.586563732008228, lng: -90.55061893873227 },
                { lat: 14.58647008803916, lng: -90.55010780354156 },
                { lat: 14.586213393184098, lng: -90.55015789251817 }
            ]
        },
        {
            id: 8,
            name: "Derecho (S7)",
            buildingCode: "S7",
            location: { lat: 14.586204011811052, lng: -90.5502677026757 },
            description: "Edificio S-7",
            walkingTime: "7 min",
            visible: true,
            customPath: [
                { lat: 14.588233845187478, lng: -90.5513648240447 },
                { lat: 14.588173988410558, lng: -90.55107238033939 },
                { lat: 14.587809286954716, lng: -90.55110657850442 },
                { lat: 14.587741148716548, lng: -90.55100532511163 },
                { lat: 14.58768209555735, lng: -90.5509268705002 },
                { lat: 14.587612659407654, lng: -90.55086585024362 },
                { lat: 14.58755230834387, lng: -90.55079745391207 },
                { lat: 14.587586701962888, lng: -90.55068211892159 },
                { lat: 14.587576967920324, lng: -90.55061104038093 },
                { lat: 14.587510127483016, lng: -90.55052990355624 },
                { lat: 14.587436797652476, lng: -90.55051246920286 },
                { lat: 14.586563732008228, lng: -90.55061893873227 },
                { lat: 14.58647008803916, lng: -90.55010780354156 },
                { lat: 14.586213393184098, lng: -90.55015789251817 }
            ]
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
            location: { lat: 14.58726143280953, lng: -90.55106898099945 },
            completed: false,
            info: "Encargado de becas, apoyo psicopedagógico y programas deportivos."
        },
        {
            id: 'rye',
            name: "RYE (Registro) / DIGA",
            buildingCode: "RYE",
            location: { lat: 14.58810341856587, lng: -90.55107019613135 },
            completed: false,
            info: "Trámites de inscripción, certificaciones y carnés universitarios."
        },
        {
            id: 'martires',
            name: "Plaza los Mártires (Entrada)",
            buildingCode: "P.M.",
            location: { lat: 14.587974147238498, lng: -90.55145296114145 },
            completed: false,
            info: "Punto final del recorrido y área central de eventos al lado de Rectoría."
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
let globalOrigin = localStorage.getItem('globalOrigin') || 'default'; // 'default' or 'user'
let locationTrackingActive = localStorage.getItem('locationTrackingActive') === 'true';
let customPolyline = null;

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
        mapTypeId: "terrain",
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

    // Initialize UI state based on stored preferences
    if (globalOrigin === 'user') {
        document.getElementById('btn-origin-user').classList.add('active');
        document.getElementById('btn-origin-default').classList.remove('active');
    }

    // Resume tracking if it was active previously
    if (locationTrackingActive) {
        tryToGetLocation();
    }
}

function tryToGetLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                locationTrackingActive = true;
                localStorage.setItem('locationTrackingActive', 'true');
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

    let foundPending = false;
    CONFIG.tourSpots.forEach(spot => {
        const isCurrentActive = !spot.completed && !foundPending;
        if (!spot.completed) foundPending = true;

        const disabledClass = (!spot.completed && !isCurrentActive) ? 'disabled' : '';

        const li = document.createElement('li');
        li.className = `checklist-item ${spot.completed ? 'completed' : ''} ${disabledClass}`;
        li.innerHTML = `
            <div class="checklist-main ${disabledClass}">
                <input type="checkbox" ${spot.completed ? 'checked' : ''} ${disabledClass ? 'disabled' : ''}>
                <span>${spot.name}</span>
            </div>
            <div class="info-wrapper">
                <button class="tour-info-btn" title="Más información">(!)</button>
                <div class="tour-tooltip">${spot.info}</div>
            </div>
        `;

        li.addEventListener('click', (e) => {
            if (!spot.completed && !isCurrentActive && !e.target.classList.contains('tour-info-btn') && !li.querySelector('.tour-tooltip').contains(e.target)) {
                return; // Prevent interaction if disabled and not clicking info
            }

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

            // Si desmarcamos un punto, obligatoriamente debemos desmarcar todos los siguientes
            if (!spot.completed) {
                let foundCurrent = false;
                CONFIG.tourSpots.forEach(s => {
                    if (foundCurrent) {
                        s.completed = false;
                    }
                    if (s.id === spot.id) {
                        foundCurrent = true;
                    }
                });
            }

            // Re-render completely to update disabled states downstream
            renderTourList();
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
    // Auto-check si el usuario está cerca del PUNTO ACTUAL en la ruta (umbral aprox 30m)
    const PROXIMITY_THRESHOLD = 0.0003;
    let changed = false;

    const currentSpot = CONFIG.tourSpots.find(s => !s.completed);
    if (currentSpot) {
        const distance = getDist(userLocation, currentSpot.location);
        if (distance < PROXIMITY_THRESHOLD) {
            currentSpot.completed = true;
            changed = true;
            console.log(`Auto-marcado: ${currentSpot.name}`);
        }
    }

    if (changed) {
        renderTourList();
    }

    const pending = CONFIG.tourSpots.filter(s => !s.completed);
    const allDone = pending.length === 0;

    document.getElementById('tour-final').classList.toggle('hidden', !allDone);

    if (!allDone) {
        // Sugerir el siguiente en la ruta obligatoria
        const nextSpot = pending[0];
        const origin = globalOrigin === 'default' ? CONFIG.startLocation : userLocation;
        const originName = globalOrigin === 'default' ? "P.B." : "Tú";
        calculateAndDisplayRoute(origin, nextSpot, originName);
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

    // Si tiene un camino manual definido, y el origen es Rectoría/P.B., lo dibujamos a mano.
    // Si el usuario eligió cualquier otro origen (como su ubicación actual o el Auditorio), usamos Google Maps normal.
    if ((originName === "Plaza las Banderas" || originName === "P.B.") && destInfo.customPath && destInfo.customPath.length > 0) {
        clearMap();

        // Si el origen NO es Rectoría/Plaza, lo conectamos también (opcional)
        // Para rutas fijas como la de S-4 es mejor si inicia desde PB
        const pathLine = [origin, ...destInfo.customPath, destInfo.location];

        customPolyline = new google.maps.Polyline({
            path: pathLine,
            geodesic: true,
            strokeColor: "#003366",
            strokeOpacity: 0.7,
            strokeWeight: 6,
            map: map
        });

        startMarker = createCustomMarker(origin, originName === "Tú" ? "Tú" : "P.B.", originName);
        endMarker = createCustomMarker(destInfo.location, destInfo.buildingCode, destInfo.name);

        const bounds = new google.maps.LatLngBounds();
        pathLine.forEach(p => bounds.extend(p));
        map.fitBounds(bounds);

        const safetyWarning = document.getElementById('safety-warning');
        const warningText = safetyWarning.querySelector('p');
        if (warningText) {
            warningText.textContent = originName === "Tú" ? "La ruta es de Google.Maps" : "¡Camina con cuidado!";
        }
        safetyWarning.classList.remove('hidden');
        setTimeout(() => safetyWarning.classList.add('hidden'), 10000);

        return; // Detenemos la función para que no llame a Google Maps
    }

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
                const warningText = safetyWarning.querySelector('p');
                if (warningText) {
                    warningText.textContent = originName === "Tú" ? "La ruta es de Google.Maps" : "¡Camina con cuidado!";
                }
                safetyWarning.classList.remove('hidden');
                setTimeout(() => safetyWarning.classList.add('hidden'), 10000);
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
    if (customPolyline) {
        customPolyline.setMap(null);
        customPolyline = null;
    }
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
        localStorage.setItem('globalOrigin', 'default');
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
        localStorage.setItem('globalOrigin', 'user');
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
