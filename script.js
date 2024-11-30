let popup = L.popup();
let map = L.map("map").setView([-25.806391, 28.148789], 16);
let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

let basemaps = {
  "Open Street Map": osm,
  "World Imagery": Esri_WorldImagery,
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
