let markerColor;
let mapOptions = {
  center: new L.LatLng(-25.806391, 28.148789),
  zoom: 16,
  messagebox: true,
};
// let map = L.map("map").setView([-25.806391, 28.148789], 16);
let map = L.map("map", mapOptions);
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

/* Live update for message box popups  */
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

const Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

const Stadia_AlidadeSatellite = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "jpg",
  }
);

const googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

const googleTraffic = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    minZoom: 2,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

let basemaps = {
  "Open Street Map": osm,
  "World Imagery": Esri_WorldImagery,
  Satellite: Stadia_AlidadeSatellite,
  // "Google Streets": googleStreets,
  // "Google Traffic": googleTraffic,
};
let overlayMaps = {};

/* Search with Geolocate  */
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
  let PowerFailure_Data = event.detail.PowerFailure_Data;

  overlayMaps["Incidents"] = Incident_Data;
  overlayMaps["Power Failures"] = PowerFailure_Data;

  L.control
    .layers(basemaps, overlayMaps, {
      position: "topleft",
    })
    .addTo(map);
});

/* Legend */
let legend = L.control({ position: "bottomleft" });
legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Incidents</h4>";
  div.innerHTML +=
    '<i style="background: #fa9346; border-radius:50%"></i><span>Burglary</span><br>';
  div.innerHTML +=
    '<i style="background: #ba0ff9;border-radius:50%"></i><span>Dog Poisoning</span><br>';
  div.innerHTML +=
    '<i style="background: #d85109;border-radius:50%"></i><span>Firearm Offence</span><br>';
  div.innerHTML +=
    '<i style="background: #900C3F;border-radius:50%"></i><span>Kidnapping/Missing Person</span><br>';
  div.innerHTML +=
    '<i style="background: #d85109;border-radius:50%"></i><span>Robbery/Armed Robbery</span><br>';
  div.innerHTML +=
    '<i style="background: #fa9346;border-radius:50%"></i><span>Theft</span><br>';
  div.innerHTML +=
    '<i style="background: #8f9ea7;border-radius:50%"></i><span>Other</span><br>';
  return div;
};
legend.addTo(map);

/* Pulsing icon */
// let pulsingIcon = L.icon.pulse({ iconSize: [10, 10], color: "red" });
// let marker = L.marker([-25.806391, 28.148789], { icon: pulsingIcon }).addTo(
//   map
// );

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked at " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);
