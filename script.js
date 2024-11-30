let popup = L.popup();
let map = L.map("map").setView([-25.806391, 28.148789], 16);
let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let Stadia_AlidadeSatellite = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "jpg",
  }
);

let basemaps = {
  "Open Street Map": osm,
  "Satellite Map": Stadia_AlidadeSatellite,
};

L.Control.geocoder().addTo(map);
L.control.layers(basemaps).addTo(map);

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked at " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);

// Show data points on map
data.forEach(function (item) {
  console.log(item);
  L.circle([item.Lat, item.Lng], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 1,
    radius: 5,
  }).addTo(map).bindPopup(`
      <b>Incident:</b>☠️ ${item.Incident}</br>
      <b>Reported Date:</b> ${item.Incident_Date_Time}</br>
      <b>Address:</b> ${item.Address}</br>
      <b>Comment:</b> ${item.Comment}
      `);
});
