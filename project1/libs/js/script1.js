var streets = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
);

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);
var basemaps = {
  "Streets": streets,
  "Satellite": satellite,
};

var map = L.map("map", {
  layers: [streets],
  center: [21.72977214201005, 82.78960330600476],
  zoom: 4,
});

var layerControl = L.control.layers(basemaps).addTo(map);



// L.marker([28.1306, 84.6493]).bindPopup("Random marker").addTo(map);



var markersLayer = L.layerGroup(); // Create a layer group for markers

// Function to get user's geolocation
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Call the function to update the dropdown with the user's country
        updateDropdownWithUserCountry(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      function (error) {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Function to update the dropdown with the user's country and add markers
async function updateDropdownWithUserCountry(latitude, longitude) {
  try {
    // Using a reverse geocoding service to get the country code
    const data = await $.ajax({
      url: "https://nominatim.openstreetmap.org/reverse",
      method: "GET",
      dataType: "json",
      data: {
        lat: latitude,
        lon: longitude,
        format: "json",
      },
    });

    if (data && (data.address || data[0])) {
      var isoCode;

      // Check for different response structures
      if (data.address && data.address.country_code) {
        isoCode = data.address.country_code.toUpperCase();
      } else if (data[0] && data[0].address && data[0].address.country_code) {
        isoCode = data[0].address.country_code.toUpperCase();
      } else {
        console.error("Unable to determine country code from reverse geocoding.");
        return;
      }

      // Select the user's country in the dropdown
      $("#countrySelect").val(isoCode).change();

      // Add markers on the selected country
      addMarkersOnCountry(data);
    } else {
      console.error("Invalid or missing data in reverse geocoding response:", data);
    }
  } catch (error) {
    console.error("Error in reverse geocoding request:", error);
  }
}

// Function to add markers on the selected country
function addMarkersOnCountry(selected) {
  // Clear existing markers
  markersLayer.clearLayers();

  // Check if the necessary properties exist in the response
  if (selected && (selected.geometry || selected[0] || (selected.lat && selected.lon))) {
    var coordinates;

    // Check for different response structures
    if (selected.geometry && selected.geometry.coordinates) {
      coordinates = selected.geometry.coordinates;
    } else if (selected[0] && selected[0].geometry && selected[0].geometry.coordinates) {
      coordinates = selected[0].geometry.coordinates;
    } else if (selected.lat && selected.lon) {
      coordinates = [parseFloat(selected.lon), parseFloat(selected.lat)];
    } else {
      console.error("Invalid or missing geometry data in reverse geocoding response:", selected);
      return;
    }

    // Create a marker using the extracted coordinates
    var marker = L.marker([coordinates[1], coordinates[0]]); // Swap lat and lon
    markersLayer.addLayer(marker);

    // Add the markers layer to the map
    markersLayer.addTo(map);
  } else {
    console.error("Invalid or missing data in reverse geocoding response:", selected);
  }
}

// Call the function to get user's location when the page loads
window.onload = function () {
  getUserLocation();
};

// AJAX call to get country data
$(document).ready(function () {
  $.ajax({
    url: "loadCountries.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Populate <select> with options
      var select = $("#countrySelect");
      localStorage.setItem("countriesList", JSON.stringify(data));
      $.each(data, function (index, country) {
        select.append(
          $("<option>", {
            value: country.isoCode,
            text: country.countryName,
          })
        );
      });
    },
    error: function () {
      console.error("Error fetching country data");
    },
  });
});

var marker;

function addMarker(e, selected) {
  console.log(e.latlng, selected);
  // Add marker to map at click location; add popup window
  marker = new L.Marker(e.latlng, { draggable: true });
  map.addLayer(marker);
  marker.bindPopup(
    "<label>country: </label><b>" +
      selected[0].countryName +
      "</b><br/><label>Isocode: </label><b>" +
      selected[0].isoCode +
      "</b>"
  ).openPopup();
}



$("#countrySelect").on("change", function () {
  let selectedval = this.value;
  $.ajax({
    url: 'countryInfo.php',
    method: 'GET',
    data: { countryIsoCode: selectedval },
    dataType: 'json',
    success: function (result) {
        for (let i = 0; i < result.data.earthquakes.length; i++) {
        L.marker([result.data.earthquakes[i].lat, result.data.earthquakes[i].lng]).addTo(map);
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX Error:', status, error);
    }
  });

  let countriesList = JSON.parse(localStorage.getItem("countriesList"));
  let selectedCountry = countriesList.filter(
    (country) => country.isoCode === selectedval
  );

  console.log(selectedCountry[0], "geo data");
  let tempobj = {
    geometry: selectedCountry[0].geometry,
    id: selectedCountry[0].isoCode,
    properties: { name: selectedCountry[0].countryName },
    type: "Feature",
  };

  var country = L.geoJson(tempobj);
  if (this.previousCountry != null) {
    map.removeLayer(this.previousCountry);
  }
  this.previousCountry = country;

  let bounds = country.getBounds();
  let center = bounds.getCenter();

  console.log(bounds, "test");
  console.log(center, "center latlng");

  if (marker) {
    map.removeLayer(marker);
  }

  addMarker({ latlng: center }, selectedCountry);

  map.addLayer(country);
  map.fitBounds(country.getBounds());
});


// Function to fetch country information and update the modal content
function fetchCountryInfo(selectedVal) {
  if (selectedVal) {
    // AJAX call to fetch country information
    $.ajax({
      url: 'countryInfoButton.php',
      method: 'GET',
      data: { countryIsoCode: selectedVal },
      dataType: 'json',
      success: function (result) {
        // Extract information from the geonames array
        var countryData = result.data.geonames[0];

        // Update modal content with country information
        $("#countryName").text(countryData.countryName);
        $("#capital").text(countryData.capital);
        $("#population").text(countryData.population);
        $("#currencyCode").text(countryData.currencyCode);
        $("#continent").text(countryData.continent);
        $("#languages").text(countryData.languages);

        // Log population value for debugging
        console.log(countryData.population);

        // Add more fields as needed

        // Show the modal
        $("#exampleModal").modal("show");
      },
      error: function (xhr, status, error) {
        console.error('AJAX Error:', status, error);
      }
    });
  } else {
    console.error('No country selected');
  }
}

// Create Leaflet Easy Button
var countryInfoButton = L.easyButton({
  states: [{
    icon: 'fas fa-flag',
    title: 'Show Country Info',
    onClick: function(btn, map) {
      let selectedVal = $("#countrySelect").val();
      fetchCountryInfo(selectedVal);
    }
  }]
});

// Add Leaflet Easy Button to the map
countryInfoButton.addTo(map);


// Function to fetch and display weather information in the Weather Modal
function fetchAndDisplayWeather(selectedVal) {
  if (selectedVal) {
    // AJAX call to fetch weather information
    $.ajax({
      url: 'getCountryAndWeatherInfo.php', // Replace with the actual filename
      method: 'GET',
      data: { countryIsoCode: selectedVal },
      dataType: 'json',
      success: function (result) {
        console.log('Weather API Response:', result); // Log the response for debugging

        var weatherObservations = result.data.weatherObservations;

        // Check if there are any weather observations
        if (weatherObservations && weatherObservations.length > 0) {
          var latestObservation = weatherObservations[0];

          // Update Weather Modal content
          $("#weatherCondition").text(latestObservation.weatherCondition);
          $("#ICAO").text(latestObservation.ICAO);
          $("#clouds").text(latestObservation.clouds);
          $("#dewPoint").text(latestObservation.dewPoint + ' °C');
          $("#cloudsCode").text(latestObservation.cloudsCode);
          $("#datetime").text(latestObservation.datetime);
          $("#temperature").text(latestObservation.temperature + ' °C');
          $("#humidity").text(latestObservation.humidity + '%');
          $("#stationName").text(latestObservation.stationName);
          $("#windDirection").text(latestObservation.windDirection + '°');
          $("#windSpeed").text(latestObservation.windSpeed + ' knots');
          $("#lat").text(latestObservation.lat);
          $("#lng").text(latestObservation.lng);

          // Show the Weather Modal
          $("#weatherModal").modal("show");
        } else {
          console.error('No weather observations available for the selected country.');
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX Error:', status, error);
      }
    });
  } else {
    console.error('No country selected');
  }
}

// Create a new Leaflet Easy Button for Weather Info in Modal
var weatherModalButton = L.easyButton({
  states: [{
    icon: 'fas fa-cloud', // Replace with your preferred icon
    title: 'Show Weather Info',
    onClick: function(btn, map) {
      var selectedVal = $("#countrySelect").val();
      fetchAndDisplayWeather(selectedVal);
    }
  }]
});

// Add Weather Modal Button to the map
weatherModalButton.addTo(map);





// Function to fetch and display Wikipedia information in the Wikipedia Modal
function fetchAndDisplayWikipedia(selectedCountryName) {
  $.ajax({
      url: 'wikipideaInfo.php', // Replace with the actual filename
      method: 'GET',
      data: { q: selectedCountryName },
      dataType: 'json',
      success: function (result) {
          if (result && result.status && result.status.code === '200' && result.data != null) {
              var wikipediaData = result.data.geonames[0];

              // Update modal content with Wikipedia information
              $("#wikipediaTitle").text(wikipediaData.title);
              $("#wikipediaSummary").text(wikipediaData.summary);
              $("#wikipediaElevation").text(wikipediaData.elevation);
              $("#wikipediaFeature").text(wikipediaData.feature);
              $("#wikipediatitle").text(wikipediaData.title);
              $("#wikipediaCountryCode").text(wikipediaData.countryCode);
              $("#wikipediaRank").text(wikipediaData.rank);

              // Update image source
              $("#wikipediaThumbnailImg").attr('src', wikipediaData.thumbnailImg);

              // Update Wikipedia link
              var wikipediaLink = "https://" + wikipediaData.wikipediaUrl;
              $("#wikipediaLink").attr('href', wikipediaLink);

              // Show the Wikipedia modal
              $("#wikipediaModal").modal("show");
          } else {
              console.error('Error in AJAX response:', result);
              $("#wikipediaTitle").text("No Data Found");
              $("#wikipediaSummary").text("No Summary Found");
              $("#wikipediaModal").modal("show");
          }
      },
      error: function (xhr, status, error) {
          console.error('AJAX Error:', status, error);
      }
  });
}

// Leaflet EasyButton for Wikipedia Info in Modal
var wikipediaButton = L.easyButton({
  states: [{
      icon: 'fab fa-wikipedia-w',
      title: 'Show Wikipedia Info',
      onClick: function (btn, map) {
          var selectedCountryName = $("#countrySelect option:selected").text(); // Get the selected country name from the dropdown
          if (selectedCountryName) {
              fetchAndDisplayWikipedia(selectedCountryName);
          } else {
              console.error('No country selected');
          }
      }
  }]
});

// Add Leaflet EasyButton to the map
wikipediaButton.addTo(map);

