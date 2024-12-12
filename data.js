let IncidentData = {
  type: "FeatureCollection",
  features: null,
};

async function getData() {
  const sheetId = "1xoWNqUkRiXsnRTepu_-gd1LacaNl0f-uV8Qn4lRJJrQ";
  const tabId = 1;
  let url = `https://opensheet.elk.sh/${sheetId}/${tabId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Transform the data to match the desired schema
    IncidentData.features = data.map((incident) => {
      const [lat, lng] = incident.LatLng.split(", ").map(Number);
      return {
        type: "Feature",
        properties: {
          ID: incident.ID,
          Incident: incident.Incident,
          Incident_Date_Time: incident.IncidentDateTime,
          Address: incident.Address,
          ImageURL: incident.ImageURL,
          Comment: incident.Comment,
          emoji: incident.Emoji,
        },
        geometry: {
          type: "Point",
          coordinates: [lat, lng],
        },
      };
    });

    // Initialize the map and add the geoJSON layer
    initializeMap();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function initializeMap() {
  let Incident_Data = L.geoJSON(IncidentData, {
    pointToLayer: function (feature, latlng) {
      // console.log(feature.properties);
      let { Incident } = feature.properties;
      let markerColor;
      switch (Incident) {
        case "Dog Poisoning":
          markerColor = "#ba0ff9";
          break;
        case "Burglary":
          markerColor = "#fa9346";
          break;
        default:
          markerColor = "#3388ff"; // Default marker color
      }

      return L.circleMarker(latlng, {
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 1,
        radius: 5,
      });
    },
  })
    .addTo(map)
    .bindPopup((layer) => {
      const {
        Incident,
        Incident_Date_Time,
        Address,
        ImageURL,
        Comment,
        emoji,
      } = layer.feature.properties;
      return `
      <b>Incident: </b>${emoji} ${Incident}</br>
      <b>IncidentDate: </b>${Incident_Date_Time}</br>
      <b>Address: </b>${Address}</br>
      <b>Comment: </b>${Comment}</br>
      <b>Image: </b><img src=${ImageURL}></br>
      `;
    });

  // Dispatch a custom event to signal that the data is ready
  document.dispatchEvent(
    new CustomEvent("dataReady", { detail: { Incident_Data } })
  );
}

// Call the function to fetch and log the data
getData();
