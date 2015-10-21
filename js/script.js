var map;
var markers = [];
var infowindow = null;
var viewModel = {};  

function initMap() {
  
  var latlng = new google.maps.LatLng(43.6425662,-79.3870568);
    
  var mapOptions = {
      center: latlng,
      scrollWheel: false,
      zoom: 14
    };


  //getting id where the map will be loaded and load global variable
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  google.maps.event.addListenerOnce(map, 'idle', function(){
  //map is fully loaded. set all markers in map
  
     viewModel = {
          locations: ko.observableArray(locationstovisit),
          query: ko.observable(''),
          currentlocationselected:ko.observable(''),
          loadlocationdetails: function (place) {
              viewModel.currentlocationselected(place.name);
              LoadFourSquareDetails(place, 'true');
          }
     };

     viewModel.locations = ko.dependentObservable(function() {
          var search = this.query().toLowerCase();
          return ko.utils.arrayFilter(locationstovisit, function(loc) {

           if (markers.length> 0)
           {
              clearMarkers();
           }

           if (search.length === 0)
              return 1;
           if (search.length > 0 && search.length < 2)
              return 0;

          return loc.name.toLowerCase().indexOf(search) >= 0;
       });
     }, viewModel);

     viewModel.locations.subscribe(DisplayAllPlaces);

     DisplayAllPlaces(locationstovisit);

     ko.applyBindings(viewModel);

   });

}

 //my favorites places to visit in toronto
 var locationstovisit = [
  {
    name:"CN Tower",
    url:"https://api.foursquare.com/v2/venues/4ad4c05ef964a52096f620e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"
  },
  {
    name:"eat fresh be healthy",
    url:"https://api.foursquare.com/v2/venues/4f209e78e4b0005b80def5de?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"
  },
  {
    name:"Kupfer & Kim",
    url:"https://api.foursquare.com/v2/venues/50e44770e4b0e03a48c0d8a8?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"
  },
  {
    name:"Fresh On Spadina",
    url:"https://api.foursquare.com/v2/venues/4ad4c05cf964a5200ff620e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"
  },
  {
    name:"Royal Ontario Museaum",
    url:"https://api.foursquare.com/v2/venues/4ad4c05ef964a520d9f620e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"
  },
  {
    name:"Rogers Center",
    url:"https://api.foursquare.com/v2/venues/4ad4c061f964a520adf720e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"

  },
  {
    name:"Toronto Islands",
    url:"https://api.foursquare.com/v2/venues/4ad4c05ef964a5209af620e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"

  },
  {
    name:"St. Lawrence Market",
    url:"https://api.foursquare.com/v2/venues/4ad4c062f964a520fbf720e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"

  },
  {
    name:"TIFF Bell Lightbox",
    url:"https://api.foursquare.com/v2/venues/4bcf714ab221c9b67f0ad2d0?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"

  },
  {
    name:"BMO Field",
    url:"https://api.foursquare.com/v2/venues/4ad4c062f964a520f3f720e3?client_id=XQ2ZGEMRPJCRRHMUI0VMHH53VLL5FYHHNDP5GXQJ12VYGQDK&client_secret=SE0GMX2FIWHB5RHSOCZTEJT5EWKDKDOZ05FMYJ4UOVG5ZSZY&v=20150715"

  }
];


//This function will create and position the markers in the map
function CreateMarkers(geodata, itemclickedfromlist){

  var marker;
  var venue = geodata.response.venue;
  var location = venue.location;
  var lat = location.lat;
  var lng = location.lng;

  if( typeof itemclickedfromlist !== 'undefined') {

      //if user pushed button, then find venue name in array and remove from map
      for (var i = 0; i < markers.length; i++) {

          if (markers[i].title == venue.name){
    
              //venue found, remove from map and array
              markers[i].setMap(null);
              markers.splice(i, 1);

              break;
          }
      }
  }

  //Create marker
  marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              animation: google.maps.Animation.DROP,
              map: map,
              title: venue.name
      });


  var address = location.address;
  var city = location.city;
  var postal = location.postalCode;

  var contact = venue.contact;
  var phone = contact.formattedPhone;

  var photos = venue.photos.groups[0].items;
  var bestphoto = venue.bestPhoto;


  marker.addListener('click', function() {

      //clear animation
      for (var i = 0; i < markers.length; i++) {
          markers[i].setAnimation(null);
      }

      //if any infowindow is open, just closed
      if (infowindow) {
          infowindow.close();
      }

      
      var venueimage = bestphoto.prefix + '100x100' + bestphoto.suffix;

      var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">'+ venue.name + '</h1>'+
          '<div id="bodyContent">'+
          '<p><b>Location:</b>' +
          address + ',' + city + ','+ postal + '</p>'+
          '<p><b>Contact:</b>' +
          phone +
          '</p>'+
          '<p><b>Website:</b> <a href="' + venue.url + '">'+
          venue.url +
          '</p>'+
          '<p><b>FourSquare:</b> <a href="' + venue.canonicalUrl + '">'+
          venue.canonicalUrl +
          '</a>' +
          '</p>'+
          '<img src="' + venueimage + '" class="img-responsive">' +
          '</div>'+
          '</div>';


      infowindow = new google.maps.InfoWindow({
          content: contentString
      });

      marker.setAnimation(google.maps.Animation.BOUNCE);


      infowindow.open(map, marker);


  });

  //display pictures of venue selected
  if( typeof itemclickedfromlist !== 'undefined') {

      //ShowImages(photos,bestphoto);

      //trigger marker click event
      google.maps.event.trigger(marker, 'click');
  }

  //add marker to array

  markers.push(marker);

  var bounds = new google.maps.LatLngBounds();
  for(var i2=0;i2<markers.length;i2++) {
      bounds.extend(markers[i2].getPosition());
  }

  //center the map to the geometric center of all markers
  map.setCenter(bounds.getCenter());

  map.fitBounds(bounds);

  //remove one zoom level to ensure no marker is on the edge.
  map.setZoom(map.getZoom()-1);

  // set a minimum zoom
  // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
  if(map.getZoom()> 15){
      map.setZoom(15);
  }
}

 //This function will clear all markers
function clearMarkers() {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    markers = [];

}

//This function will load all details from foursquare API
function LoadFourSquareDetails(place, itemclickedfromlist)
{


    //remove all markers only when itemclickedfromlist parameter is empty
    if (markers.length> 0 && typeof itemclickedfromlist === 'undefined')
    {
        clearMarkers();

    }

    var options = {
        url:place.url,
        type: 'GET',
        datatype: 'json'
    };

    $.ajax(options)
        .done(function( data ) {

            CreateMarkers(data,itemclickedfromlist);
        }
    ).fail(
        function(data){
            
            //show alert in case foursquare is down

          var errmsg = document.getElementsByClassName('alert-danger');
          
              
          if (errmsg.length === 0) {
            
          
            var alertDiv = document.createElement('div');
            alertDiv.innerHTML = 'Unable to call Foursquare API';
            alertDiv.className = 'alert alert-danger';
            document.getElementById('errmsg').appendChild(alertDiv);
          }
            
        }
    );

}


//this function will loop for all my favorites places to go and set the markers
var DisplayAllPlaces = function (places) {

    viewModel.currentlocationselected('');
    var allplacestovisitlen = places.length;

    for(var i=0; i< allplacestovisitlen;i++ )
    {
        var place = places[i];

        LoadFourSquareDetails(place);

    }
};

