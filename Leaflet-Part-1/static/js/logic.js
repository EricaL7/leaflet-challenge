// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let myMap; // Declare myMap as a global variable

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Function to create a legend
function createLegend() {
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let grades = [0, 2, 3, 4, 5];
    let colors = ['#00FF00', '#ADFF2F', '#FFFF00', '#FFA500', '#FF0000'];

    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);
}

// Function to create earthquake features
function createFeatures(earthquakeData) {
  // Define a function to determine the marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier as needed for an appropriate marker size
  }

  // Define a function to determine the marker color based on magnitude
  function markerColor(magnitude) {
    return magnitude > 5 ? '#FF0000' :
      magnitude > 4 ? '#FFA500' :
      magnitude > 3 ? '#FFFF00' :
      magnitude > 2 ? '#ADFF2F' :
      '#00FF00';
  }

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, time, and magnitude of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
  }

  // Create a GeoJSON layer with markers based on earthquakeData
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Function to create the map
function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the street map and earthquakes layers to display on load.
  myMap = L.map("map", {
    center: [55, -120],
    zoom: 4,
    layers: [street, earthquakes]
  });

// Create a legend to display information about our map.
let info = L.control({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend".
  info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map.
  info.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Call the function to create the legend
 updateLegend();
}

// Update the legend's innerHTML with the last updated time and station count.
function updateLegend() {
  document.querySelector(".legend").innerHTML = [
    "<p class='greaterThanFive'> Magnitude > 5: </p>",
    "<p class='greaterThanFour'> Magnitude > 4: </p>",
    "<p class='greaterThanThree'> Magnitude > 3: </p>",
    "<p class='greaterThanTwo'> Magnitude > 2: </p>",
    "<p class='greaterThanZero'> Magnitude 0-2: </p>",
  ].join("");
}




