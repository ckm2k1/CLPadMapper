/*global coordCache:false google:false*/
var gmaps = google.maps;

var geocoder = new gmaps.Geocoder();
//Create the google map
var map;
var markers = [];
var infoWindow = new gmaps.InfoWindow({
  map: map
});

//thanks to SO entry:
//http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker
//Uses regular google image for fresh pin and defines an icon for a visited pin.
//Visited pin icon
var pinColor = "CCCCCC";
var pinImageVis = new gmaps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor
      , new gmaps.Size(21, 34)
      , new gmaps.Point(0, 0)
      , new gmaps.Point(10, 34));
var pinShadowVis = new gmaps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow"
      , new gmaps.Size(40, 37)
      , new gmaps.Point(0, 0)
      , new gmaps.Point(12, 35));

function initialize() {
  var myOptions = {
    center: new gmaps.LatLng(-34.397, 150.644),
    zoom: 12,
    mapTypeId: gmaps.MapTypeId.ROADMAP
  };
  map = new gmaps.Map($("#map_canvas").get(0), myOptions);
  //Initialize the map to Montreal
  map.setCenter(new gmaps.LatLng(45.50866990, -73.55399249999999));


  for (var x = 0; x < coordCache.length; x++) {
    var coords = coordCache[x].coords,
      container = {},
      marker = new gmaps.Marker({
        position: new gmaps.LatLng(coords.lat, coords.lng),
        map: map
      });

    //Extend the object with some necessary properties
    //for the template.
    var cachedElem = coordCache[x];

    container.rent = cachedElem.rent;
    container.bedrooms = cachedElem.bedrooms;
    container.title = cachedElem.title;
    container.body = cachedElem.body;
    container.clPostURL = cachedElem.clURL;
    container.marker = marker;
    container.pics = cachedElem.imageList;

    markers.push(container);
  }
  //Hook up the markers' click event with the CL info window.
  $.each(markers, function(index, value) {
    gmaps.event.addListener(value.marker, 'click', function() {


      marker = value.marker;
      var content = tmpl("info_template", value)

      infoWindow.setContent(content);
      infoWindow.open(map, marker);

      //Set the marker icon to the gray image.
      marker.setIcon(pinImageVis);
      marker.setShadow(pinShadowVis);
    });
  });
  // initialize the ranges
  markers.rent = [650, 900];
  markers.bedrooms = [1, 1];
}


function filterMarkers(list, props) {
  var min = 0,
    max = 1;
  for (var i = 0; i < list.length; i++) {
    var passes = false,
      marker = list[i];
    for (var x = 0; x < props.length; x++) {
      var prop = props[x];
      if (marker[prop] >= list[prop][min] && marker[prop] <= list[prop][max]) {
        passes = true;
        continue;
      } else {
        passes = false;
        break;
      }
    }
    passes ? marker.marker.setMap(map) : marker.marker.setMap(null);
  }
}