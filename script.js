let markerColor;
var options = {
  center: new L.LatLng(-25.806391, 28.148789),
  zoom: 16,
  messagebox: true,
};
// let map = L.map("map").setView([-25.806391, 28.148789], 16);
let map = L.map("map", options);
let popup = L.popup();
const apiKey =
  "AAPK38d5964a655b48dbb8fb30fe5bc1098co28bAFzHHonjZPlh5QIp2DRruOGyamDWbvQJegvAQlvfxlKs94COtvB-ad44WdjI";
const sidepanelLeft = L.control
  .sidepanel("mySidepanelLeft", {
    tabsPosition: "left",
    startTab: "tab-5",
  })
  .addTo(map);

// var messages = [
//   "Lorum ipsum",
//   'Buy me a beer <img src="https://www.grendelman.net/wp/wp-includes/images/smilies/icon_smile.gif" />',
//   "Let me google that for you",
//   "Multi-line<br />messages<br />are also<br />possible",
// ];
var messages = [
  "Lorum ipsum",
  "Multi-line<br />Lorum ipsum<br />Lorum ipsum<br />Lorum ipsum",
];
// var positions = ["topleft", "topright", "bottomleft", "bottomright"];
var positions = ["bottomright"];

L.control.liveupdate({
  update_map: function () {
    var i = Math.floor(Math.random() * messages.length);
    var msg = messages[i];
    var j = Math.floor(Math.random() * positions.length);
    var pos = positions[j];
    map.messagebox.setPosition(pos);
    map.messagebox.options.timeout = 6000;
    map.messagebox.show(msg);
  },
  position: "topleft",
  interval: 5000,
});
// .addTo(map)
// .startUpdating();

let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

let basemaps = {
  "Open Street Map": osm,
  "World Imagery": Esri_WorldImagery,
};

let overlayMaps = {};

// L.Control.geocoder().addTo(map);
const searchControl = L.esri.Geocoding.geosearch({
  position: "topright",
  useMapBounds: false,
  providers: [
    L.esri.Geocoding.arcgisOnlineProvider({
      apikey: apiKey,
    }),
  ],
}).addTo(map);

const results = L.layerGroup().addTo(map);

searchControl.on("results", function (data) {
  results.clearLayers();
  for (let i = data.results.length - 1; i >= 0; i--) {
    console.log(data.results[i]);
    results.addLayer(
      L.marker(data.results[i].latlng).bindPopup(
        `
        ${data.results[i].latlng}</br>
        Address:  ${data.results[i].properties.Match_addr}</br>
        `
      )
    );
    console.log(data.results[i].latlng);
  }
});

document.addEventListener("dataReady", function (event) {
  let Incident_Data = event.detail.Incident_Data;

  overlayMaps["Incident Data"] = Incident_Data;

  L.control
    .layers(basemaps, overlayMaps, {
      position: "topleft",
    })
    .addTo(map);
});

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked at " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);
