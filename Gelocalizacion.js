getLocation();
const MAP_KEY = '';
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
   let latlon = position.coords.longitude + "," + position.coords.latitude;
  // TO MAKE THE MAP APPEAR YOU MUST
	// ADD YOUR ACCESS TOKEN FROM
	// https://account.mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jlc3MyMCIsImEiOiJja3M0cWFqamExNDR6Mndyd3Jtb2s2bjYxIn0.EQn2WADc0cDphAxBc-XNLg';
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: latlon.split(','), // starting position [lng, lat]
    zoom: 15 // starting zoom
    });
    // Add geolocate control to the map.
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      });

    map.addControl(geolocateControl);

    const greenMarker = new mapboxgl.Marker({
      color: 'green'
    })
    .setLngLat(latlon.split(','))
    .addTo(map);

    const purpleMarker = new mapboxgl.Marker({
      color: 'purple'
    })
    .setLngLat([-58.52011629999999, -34.5])
    .addTo(map);

    const units = {
      units: 'kilometers'
    }; // units can be degrees, radians, miles, or kilometers, just be sure to change the units in the text box to match. 
    const distance = turf.distance(latlon.split(','), [-58.52011629999999, -34.5], units);
    let value = document.getElementById('map-overlay')
    value.innerHTML = "Distancia: " + distance.toFixed([2]) + " kilometros."

    map.on('load', () => {
      // Add an image to use as a custom marker
      map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      (error, image) => {
      if (error) throw error;
      map.addImage('custom-marker', image);
      // Add a GeoJSON source with 2 points
      map.addSource('points', {
      'type': 'geojson',
      'data': {
      'type': 'FeatureCollection',
      'features': [
      {
      // feature for Mapbox DC
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': [
      latlon.split(',')
      ]
      },
      'properties': {
      'title': 'Mi Ubicacion'
      }
      }
      ]
      }
      });
       
      // Add a symbol layer
      map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
      'icon-image': 'custom-marker',
      // get the title name from the source's "title" property
      'text-field': ['get', 'title'],
      'text-font': [
      'Open Sans Semibold',
      'Arial Unicode MS Bold'
      ],
      'text-offset': [0, 1.25],
      'text-anchor': 'top'
      }
      });
      }
      );
      //geolocateControl.trigger('geolocate');
      });
      
}