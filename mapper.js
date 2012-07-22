/*global coordCache:false google:false*/

var geocoder = new google.maps.Geocoder();
//Create the google map
var map;
var markers = [];
var infoWindow = new google.maps.InfoWindow({
  map: map
});

function iwMouseover(i){$("img#iwi").replaceWith('<img id="iwi" src="'+imgList[i]+'" alt="image '+i+'">');return false;}

function initialize() {
  var myOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($("#map_canvas").get(0), myOptions);
  //Initialize the map to Montreal
  map.setCenter(new google.maps.LatLng(45.50866990, -73.55399249999999));


  for (var x = 0; x < coordCache.length; x++) {
    var coords = coordCache[x].coords
    , container = {}
    , marker = new google.maps.Marker({
          position: new google.maps.LatLng(coords.lat, coords.lng)
        , map: map
      });

    //Extend the object with some necessary properties
    //for the template.
    container.rent = coordCache[x].rent;
    container.bedrooms = coordCache[x].bedrooms;
    container.title = coordCache[x].title;
    container.body = coordCache[x].body;
    container.clPostURL = coordCache[x].clURL;
    container.marker = marker;

    markers.push(container);
  }
  //Initialize the markers' click event with the CL info window.
  $.each(markers, function(index, value) {
    google.maps.event.addListener(value.marker, 'click', function() {
      var i, index;

      index = markers.indexOf(value);
      var content = tmpl("info_template", markers[index])
      infoWindow.setContent(content);
      infoWindow.open(map, markers[index].marker);
    });
  });
  markers.rent = [500, 1000];
  markers.bedrooms = [1, 2];
}


function filterMarkers(list, props) {
  var min = 0
  , max = 1;
  for (var i = 0; i < list.length; i++) {
    var passes = false
    , marker = list[i];
    for (var x = 0; x < props.length; x++) {
      var prop = props[x];
      if (marker[prop] >= list[prop][min] && marker[prop] <= list[prop][max]) {
        passes = true;
        continue;
      }
      else {
        passes = false;
        break;
      }
    }
    passes ? marker.marker.setMap(map) : marker.marker.setMap(null);
  }
}

function inRange (val, min, max) {
  return val >= min && val <= max;
}
