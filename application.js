// Application Javascript
var autocomplete, input, address = {};

$(document).ready(function(){
  input = $("#searchBox");
  $("#searchBox").clearOnFocus();
  $('form').submit(function(){ return false; });
});

var init = function(){
  google.maps.event.addDomListener(window, 'load', makePlaces);
};

var makePlaces = function(){

  var options = {
    types: ['(regions)'],
    componentRestrictions: {country: "us"}
  };
  autocomplete = new google.maps.places.Autocomplete(input[0], options);
  bindPlaces();
};

var bindPlaces = function(){
  var placeData;
  google.maps.event.addListener(autocomplete, 'place_changed', function(){
    address = {};
    placeData = autocomplete.getPlace();
    createAddress(placeData);
    format_address();
    generate_url(determineType());
  });
};

var createAddress = function(placeData){
  address.city = placeData.vicinity;
  console.log(placeData);
  if (placeData.types[0] == 'postal_code'){
    address.zip = placeData.name;
    address.state = placeData.address_components[3].long_name;
  } else {
    if(placeData.address_components.length >= 4) {
      address.state = placeData.address_components[2].long_name;
    } else {
      address.state = placeData.address_components[1].long_name;
    }
  }
};

var determineType = function(search_result){
  var type;
  type = address.zip ? 'zip' : 'apartments';
  return type;
};

var generate_url = function(type){
  new_url = type + "/" + address.state + '/' + address.city;
  $('body').append('<p><a href=' + new_url + '>' + new_url + '</a></p>');
};

var format_address = function(){
  $.each(address, function(k,v){ address[k] = v.replace(' ', '-'); });
};

$.fn.clearOnFocus = function(){
  $(this).on('focus',function(){$(this).val('');});
  return $(this);
};

