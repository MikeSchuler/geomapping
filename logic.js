var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"


var myMap = L.map("map", {
    center: [
        0.0, 0.0
    ],
    zoom: 2
    // layers: [streetmap, earthquakes]
  });

var geomap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Earthquake data &copy; <a href=\"https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php\">USGS</a> Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoibXNjaHVlbHIiLCJhIjoiY2pwa2p0emo0MDIyODQybmxxNmxtOWluciJ9.W0AlrXR4AimkjoAt58vHnw"

  }).addTo(myMap);

  function getColor(size){
    if(size < 4.5){
        return '#fef0d9';
    }else if(size <= 5){
        return '#fdcc8a';
    }else if(size <= 6){
      return '#fc8d59';
    }else if(size <= 7){
      return '#e34a33';
    }else if(size > 7 ){
      return '#b30000';
    }else{
        return 'black';
    }
};

d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data) 

    data.features.forEach(function(e) {
        var circle = L.circle([e.geometry.coordinates[1], e.geometry.coordinates[0]], {          
            color: "black",
            weight: 1,          
            fillColor: getColor(e.properties.mag),       
            fillOpacity: 1,         
            radius: e.properties.mag * 30000   
          }).addTo(myMap); 
        
  
          circle.bindPopup(`<h3>Magnitude: ${e.properties.mag}</h3><p>Location: ${e.properties.place}<br>
          Date and Time: ${new Date(e.properties.time)}<br>
          More Info: <a href="${e.properties.url}" target="_blank" rel="noopener">LINK</a>
           </p>`)
    })

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 4.5, 6, 7],
        labels = []

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

  });

 