// Data **************************************************************************
let data = [
  {
    ID: 1,
    Incident: "Dog Poisoning",
    Incident_Date_Time: "27/11/2024 00:01:00",
    Address: "31 Flora Road",
    Lat: -25.806358,
    Lng: 28.148748,
  },
  {
    ID: 2,
    Incident: "Dog Poisoning",
    Incident_Date_Time: "27/11/2024 00:01:00",
    Address: "29 Flora Road",
    Lat: -25.806174,
    Lng: 28.148598,
  },
  {
    ID: 3,
    Incident: "Dog Poisoning",
    Incident_Date_Time: "27/11/2024 00:01:00",
    Address: "32 Flora Road",
    Lat: -25.806252,
    Lng: 28.149076,
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
    .setContent("You clicked at " + e.latlng.toString())
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
  }).addTo(map).bindPopup(`
      <b>Incident:</b>☠️ ${item.Incident}</br>
      <b>Reported Date:</b> ${item.Incident_Date_Time}</br>
      <b>Address:</b> ${item.Address}
      `);
});
