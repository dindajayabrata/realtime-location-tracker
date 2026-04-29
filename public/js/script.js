const socket = io();
const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (err) => {
        console.error("Geolocation error:", err.message);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map('map', { center: [0, 0], zoom: 16 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

map.on('load', () => {
    document.getElementById('loading').style.display = 'none';
});

socket.on('receive-location', (data) => {
    const { latitude, longitude, id } = data;
    console.log(`Received location from user ${id}: ${latitude}, ${longitude}`);

    map.setView([latitude, longitude], 14);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`User ${id}`).openPopup();
    }
});

socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
