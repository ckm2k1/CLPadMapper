
function sliderCallback(elem, passes) {
  passes ? elem.marker.setMap(map) : elem.marker.setMap(null);
}
function filter() {
  filterMarkers(markers, ["rent", "bedrooms"]);
}

var sliders = function() {

  $( ".slider-rentrange" ).slider({
      values: [500, 1000]
    , range: true
    , min: 200
    , max: 3000
    , step: 50
    , change: function(event, ui) {
        markers.rent = [ui.values[0], ui.values[1]];
        filter();
        // filterMarkers("rent", ui.values[0], ui.values[1]);
      }
    , slide: function (event, ui) {
        $( ".rent-label" ).html( "$"
          + ui.values[0]
          + " - $"
          + ui.values[1]);
      }
  });
  $( ".slider-bedrooms" ).slider({
      values: [1, 2]
    , range : true
    , min   : 1
    , max   : 7
    , step  : 1
    , change: function(event, ui) {
        markers.bedrooms = [ui.values[0], ui.values[1]];
        filter();
        // filterMarkers("bedrooms", ui.values[0], ui.values[1]);
      }
    , slide: function (event, ui) {
        $( ".bedroom-label" ).html(
            ui.values[0]
          + " - "
          + ui.values[1]
          + " Beds ");
      }
  });

  //Initialize the labels.
  $(".bedroom-label").html($(".slider-bedrooms").slider('value') + "br");
  $( ".bedroom-label" ).html(
      $( ".slider-bedrooms" ).slider( "values", 0 )
    + " - "
    + $( ".slider-bedrooms" ).slider( "values", 1 )
    + " Beds " );
  $( ".rent-label" ).html( "$"
    + $( ".slider-rentrange" ).slider( "values", 0 )
    + " - $"
    + $( ".slider-rentrange" ).slider( "values", 1 ) );
};
