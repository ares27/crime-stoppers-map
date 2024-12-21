let IncidentData = {
  type: "FeatureCollection",
  features: null,
};

let PowerFailureData = {
  type: "FeatureCollection",
  features: null,
};

async function getIncidentData() {
  const sheetId = "1xoWNqUkRiXsnRTepu_-gd1LacaNl0f-uV8Qn4lRJJrQ";
  const tabId = 1;
  let url = `https://opensheet.elk.sh/${sheetId}/${tabId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log("incident data");
    // console.log(data);

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
    // initializeMap();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getPowerFailureData() {
  // const sheetId = "1xoWNqUkRiXsnRTepu_-gd1LacaNl0f-uV8Qn4lRJJrQ";
  // const tabId = 2;
  const sheetId = "1ENeCkhX3EHlQHY7Q6MhQBiAWriAXVVePR9rn9XCVTFY";
  const tabId = 1;
  let url = `https://opensheet.elk.sh/${sheetId}/${tabId}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    // Transform the data to match the desired schema
    PowerFailureData.features = data
      .filter(
        (line) =>
          (line.Coords !== undefined || line.Coords !== "") &&
          line.Status == "Open"
      ) // Filter out undefined Coords
      // .filter((line) => line.Coords !== "") // Filter out blank Coords
      // .filter((line) => line.Status == "Open") // Filter for Open Coords
      .map((line) => {
        // Remove the outer quotes and parse the coordinates
        console.log(line);
        const coordinates = line.Coords.replace(/^\[|\]$/g, "") // Remove the outer brackets
          .split("],[") // Split into individual coordinate pairs
          .map((coord) => coord.split(",").map(Number)); // Parse each pair

        return {
          type: "Feature",
          properties: {
            street: line.Street,
            suburb: line.Suburb,
            reported: line.Reported,
          },
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        };
      });
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
        case "Burglary":
          markerColor = "#fa9346";
          break;
        case "Dog Poisoning":
          markerColor = "#ba0ff9";
          break;
        case "Firearm Offence":
          markerColor = "#d85109";
          break;
        case "Robbery/Armed Robbery":
          markerColor = "#d85109";
          break;
        case "Kidnapping/Missing Person":
          markerColor = "#900C3F";
          break;
        case "Robbery/Armed Robbery":
          markerColor = "#d85109";
          break;
        case "Theft":
          markerColor = "#fa9346";
          break;
        default:
          markerColor = "#8f9ea7"; // Default marker color
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

  // Add the PowerFailureData layer
  let PowerFailure_Data = L.geoJSON(PowerFailureData, {
    style: function (feature) {
      // Customize the style for line features
      return { color: "red", weight: 2 };
    },
  })
    // .addTo(map)
    .bindPopup((layer) => {
      return `
        Category: Power Failure</br>
        Street: ${layer.feature.properties.street}</br>
        Suburb: ${layer.feature.properties.suburb}
        `;
    });

  // Dispatch a custom event to signal that the data is ready
  document.dispatchEvent(
    new CustomEvent("dataReady", {
      detail: { Incident_Data, PowerFailure_Data },
    })
  );
}

// Initialize counters for datasets
let datasetsReady = 0;

// Function to check if both datasets are ready
function checkDatasetsReady() {
  datasetsReady++;
  if (datasetsReady === 2) {
    initializeMap();
  }
}

// Call getIncidentData and check if it's ready
getIncidentData().then(checkDatasetsReady);

// Call getPowerFailureData and check if it's ready
getPowerFailureData().then(checkDatasetsReady);
