// Data **************************************************************************
let data = [
  {
    ID: 1,
    Incident: "Dog Poisoning",
    Address: "31 Flora Road",
    Lat: -25.806391,
    Lng: 28.148789,
  },
  {
    ID: 2,
    Incident: "Dog Poisoning",
    Address: "32 Flora Road",
    Lat: -25.806266,
    Lng: 28.148754,
  },
];
// Data **************************************************************************
let popup = L.popup();
let map = L.map("map").setView([-25.806391, 28.148789], 16);
let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
osm.addTo(map);

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);

// Reverse geolocation: get street address from latlon

// Show data point on map
data.forEach(function (item) {
  console.log(item);
  L.circle([item.Lat, item.Lng], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 1,
    radius: 5,
  })
    .addTo(map)
    .bindPopup(`<b>${item.Incident}</b><br>${item.Address}`);
});
