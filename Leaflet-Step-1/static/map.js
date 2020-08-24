  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

  d3.json(url, function(data) {
      console.log(data.features)
   });



  function markerSize(mag) {
    return mag * 20000;
  }
  
  function markerColor(mag) {
    if (mag <= 1) {
      return "#00ffff";
    } else if (mag <= 2) {
      return "#9ACD32";
    } else if (mag <= 3) {
      return "#FFFF00";
    } else if (mag <= 4) {
      return "#ffe55c";
    } else if (mag <= 5) {
      return "#ff8000";
    } else if (mag <= 6) {
      return "#FF0000";
    } else {
      return "#990000";
    };
  }

  
  
  // Query the URL
  d3.json(url, function (data) {
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    var earthquakes = L.geoJSON(earthquakeData, {
     
      onEachFeature: function (feature, layer) {
  
        layer.bindPopup("<h2>" + feature.properties.place +
          "</h2><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
      }, pointToLayer: function (feature, latlng) {
        return L.circle(latlng,
          {
            fillOpacity: 5,
            color: "black",
            weight: 0.5,
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.properties.mag),
          })

      }
    });
  
    // Earthquakes layers to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define satelitemap and lightmap layers
  
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
    
    var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-streets-v11',
      accessToken: API_KEY
    });
  
    // Base Maps
    var baseMaps = {
      "Satellite Map": satellitemap,
      "Light Map": lightmap
    };
  
    // Create an overlay map layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create my map, giving it to the satelitemap and earthquakes layers 
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [satellitemap, earthquakes]
    });
  
    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function () {
      // create a legend 
      var div = L.DomUtil.create('div', 'legend'),
        magnitudes = [0, 1, 2, 3, 4, 5, 6,];
  
      for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
          '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' +
          + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  
  }
