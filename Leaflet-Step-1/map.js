var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(url, function(data) {
    console.log(data.features)
  });

