let markerColor;
let map = L.map("map").setView([-25.806391, 28.148789], 16);
let popup = L.popup();
const apiKey =
  "AAPK38d5964a655b48dbb8fb30fe5bc1098co28bAFzHHonjZPlh5QIp2DRruOGyamDWbvQJegvAQlvfxlKs94COtvB-ad44WdjI";

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
        <hr>
        <form id="form">
          <label for="incidents">Incident:</label></br>
            <select name="incidents" id="incidents">
              <option value="burglary">Burglary</option>
              <option value="dogpoisoning">Dog Poisoning</option>
              <option value="other">Other</option>
            </select></br>
          <label for="comments">Comments:</label></br>
          <textarea id="comments" name="comments" rows="2" cols="20"></textarea></br>
          <input type="submit" value="Submit">
        </form> 
        `
      )
    );
    console.log(data.results[i].latlng);
  }
});

document.addEventListener("dataReady", function (event) {
  let Incident_Data = event.detail.Incident_Data;

  overlayMaps["Incident Data"] = Incident_Data;

  L.control.layers(basemaps, overlayMaps).addTo(map);
});

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked at " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);
