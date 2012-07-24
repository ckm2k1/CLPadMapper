
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
          + " BR ");
      }
  });

  //Initialize the labels.
  var slider_bed  = $( ".slider-bedrooms" )
  , slider_rent   = $( ".slider-rentrange" );

  $( ".bedroom-label" ).html(
      slider_bed.slider("values", 0)
    + " - "
    + slider_bed.slider("values", 1)
    + " BR "
   );

  $( ".rent-label" ).html( "$"
    + slider_rent.slider("values", 0)
    + " - $"
    + slider_rent.slider("values", 1)
    );
};
