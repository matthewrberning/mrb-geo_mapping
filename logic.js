// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<hr>" + "Magnitude: " + feature.properties.mag);
  }

//   });

  function marker_color(d) {
    return d > 5 ? '#0000ff' :
      d > 4.5 ? '#803ce4' :
      d > 4 ? '#ab66cb' :
      d > 3.5 ? '#ca8eb5' :
      d > 3 ? '#e1b4a3' :
      d > 1 ? '#f4db9c' :
      d > 0.3 ? '#ffffe0' :
      '#000000';
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    pointToLayer: function(feature, layer) {
      return L.circleMarker(layer, {
        radius: (4 * feature.properties.mag),
        fillColor: marker_color(feature.properties.mag),
        weight: .5,
        opacity: 0.5,
        color: 'black',
        fillOpacity: 0.85
      });
    }
  });





  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}





function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });



//Ledgend placeholder






//Ledgend placeholder





  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
