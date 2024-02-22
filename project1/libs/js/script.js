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

// Define basemaps object
var basemaps = {
  "Streets": streets,
  "Satellite": satellite,
};

// Create map object with default street view
var map = L.map("map", {
  layers: [streets],
  center: [21.72977214201005, 82.78960330600476],
  zoom: 4,
});

// Define marker clusters for airports and cities
var airports = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#fff',
    color: '#000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);

var cities = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#fff',
    color: '#000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);

// Define icons for airport and city markers
var airportIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-plane',
  iconColor: 'black',
  markerColor: 'white',
  shape: 'square'
});

var cityIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-city',
  markerColor: 'green',
  shape: 'square'
});

// Define overlays object for layer control
var overlays = {
  "Airports": airports,
  "Cities": cities
};

// Create layer control and add it to the map
var layerControl = L.control.layers(basemaps, overlays).addTo(map);

// Function to get user's location and update country dropdown
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      updateDropdownWithUserCountry(position.coords.latitude, position.coords.longitude);
    });
  }
}

// Call getUserLocation on window load
window.onload = function () {
  getUserLocation();
};

// AJAX call to load countries data and populate country dropdown
$(document).ready(function () {
  $(document).one("ajaxStart", function () {
    $("#preloader").show();
  }).one("ajaxStop", function () {
    $("#preloader").hide();
  });
  
  $.ajax({
    url: "loadCountries.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
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
      getUserLocation();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error fetching country data:', errorThrown);
    }
  });
});

// Function to update country dropdown based on user's location
function updateDropdownWithUserCountry(latitude, longitude) {
  $.ajax({
      url: "countryCode.php",
      method: "GET",
      dataType: "json",
      data: {
          latitude: latitude,
          longitude: longitude
      },
      success: function(data) {
          if (data && data.countryCode) {
              var isoCode = data.countryCode.toUpperCase();
              $("#countrySelect").val(isoCode).change();
              isoCodeToCountryName(isoCode, function(selectedCountryName) {
                  addAirportMarkers(selectedCountryName);
              });
          } else {
              console.error("Invalid or missing data from GeoNames API");
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error fetching country data:', errorThrown);
      }
  });
}

    
  


// Function to convert ISO code to country name
function isoCodeToCountryName(isoCode, callback) {
  $.ajax({
      url: 'loadCountries.php',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          for (let i = 0; i < data.length; i++) {
              if (data[i].isoCode === isoCode) {
                  callback(data[i].countryName);
                  return;
              }
          }
          callback('Country Not Found');
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.error('Error fetching country data:', errorThrown);
          callback('Error');
      }
  });
}




var airportsLoadedForCountry = {}; // Object to keep track of airports loaded for each country

// Function to add airport markers to the map
function addAirportMarkers(selectedCountryName) {
  // Check if airports have already been loaded for the selected country
  if (airportsLoadedForCountry[selectedCountryName]) {
    return; // Exit the function if airports are already loaded for the selected country
  }

  airports.clearLayers();
  var addedAirports = {}; // Object to keep track of added airports
  $.ajax({
    url: "airport1.php",
    method: 'GET',
    data: { countryName: selectedCountryName },
    dataType: 'json',
    success: function (result) {
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var item = result[key];
          var name = item.name;
          if (item.lat && item.lon) {
            var lat = parseFloat(item.lat);
            var lon = parseFloat(item.lon);
            if (!isNaN(lat) && !isNaN(lon)) {
              // Create a unique identifier for the airport based on its name and coordinates
              var airportId = name + '_' + lat + '_' + lon;
              // Check if the airport has already been added
              if (!addedAirports.hasOwnProperty(airportId)) {
                // Add the marker to the map
                L.marker([lat, lon], {icon: airportIcon})
                  .bindTooltip(name, {direction: 'top', sticky: true})
                  .addTo(airports);
                // Add the airport to the list of added airports
                addedAirports[airportId] = true;
              }
            } else {
              console.error("Invalid latitude or longitude:", item);
            }
          } else {
            console.error("Missing latitude or longitude:", item);
          }
        }
      }
      // Mark that airports have been loaded for the selected country
      airportsLoadedForCountry[selectedCountryName] = true;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error retrieving airport data:", errorThrown);
    }
  });
}




    
         




var citiesLoadedForCountry = {}; // Object to keep track of cities loaded for each country

// Function to add city markers to the map
function addCityMarkers(selectedCountryName) {
  // Check if cities have already been loaded for the selected country
  if (citiesLoadedForCountry[selectedCountryName]) {
    return; // Exit the function if cities are already loaded for the selected country
  }

  cities.clearLayers();
  $.ajax({
    url: "getCities.php",
    method: 'GET',
    data: { countryName: selectedCountryName },
    dataType: 'json',
    success: function (result) {
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          var item = result[key];
          var city = item.city;
          if (item.lat && item.lon) {
            var lat = parseFloat(item.lat) - 0.08; // Adjust latitude by adding a small value
            var lon = parseFloat(item.lon);
            if (!isNaN(lat) && !isNaN(lon)) {
              L.marker([lat, lon], {icon: cityIcon})
                .bindTooltip(city, {direction: 'top', sticky: true})
                .addTo(cities);
            } else {
              console.error("Invalid latitude or longitude:", item);
            }
          } else {
            console.error("Missing latitude or longitude:", item);
          }
        }
      }
      // Mark that cities have been loaded for the selected country
      citiesLoadedForCountry[selectedCountryName] = true;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error retrieving city data:", errorThrown);
    }
  });
}


// Event handler for country select change
$("#countrySelect").on("change", function () {
  var selectedval = this.value;
  isoCodeToCountryName(selectedval, function(selectedCountryName) {
    addAirportMarkers(selectedCountryName);
    addCityMarkers(selectedCountryName);
    
    // Retrieve country data
    let countriesList = JSON.parse(localStorage.getItem("countriesList"));
    let selectedCountry = countriesList.find(
      (country) => country.countryName === selectedCountryName
    );

    // If country data is found, create GeoJSON object and add it to the map
    if (selectedCountry) {
      var tempobj = {
        geometry: selectedCountry.geometry,
        id: selectedCountry.isoCode,
        properties: { name: selectedCountry.countryName },
        type: "Feature",
      };

      var country = L.geoJson(tempobj);
      if (this.previousCountry != null) {
        map.removeLayer(this.previousCountry);
      }
      this.previousCountry = country;

      map.addLayer(country);
      map.fitBounds(country.getBounds());
    } else {
      console.error("Selected country not found in the countries list");
    }
  });
});







function formatPopulation(population) {
  return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Define function to get icon class based on content
function getIconClass(content) {
  switch(content) {
    case "countryName":
      return "fa-solid fa-flag fa-xl text-success";
    case "capital":
      return "fa-solid fa-landmark-flag fa-xl text-success";
    case "population":
      return "fa-solid fa-person fa-xl text-success";
    case "currency":
      return "fa-solid fa-coins fa-xl text-success";
    case "continent":
      return "fa-solid fa-globe fa-xl text-success";
    default:
      return "";
  }
}

function fetchCountryInfo(selectedVal) {
  if (selectedVal) {
    // AJAX call to fetch country information
    $.ajax({
      url: 'countryInfoButton.php',
      method: 'GET',
      data: { countryIsoCode: selectedVal },
      dataType: 'json',
      success: function (result) {
        var countryData = result.data.geonames[0];
        $("#countryName").text(countryData.countryName);
        $("#countryNameIcon").removeClass().addClass(getIconClass("countryName")); // Example usage of icon class
        
        $("#capital").text(countryData.capital);
        $("#capitalIcon").removeClass().addClass(getIconClass("capital"));
        
        $("#population").text(formatPopulation(countryData.population));
        $("#populationIcon").removeClass().addClass(getIconClass("population"));
        
        $("#currencyCode").text(countryData.currencyCode);
        $("#currencyCodeIcon").removeClass().addClass(getIconClass("currency"));
        
        $("#continent").text(countryData.continent);
        $("#continentIcon").removeClass().addClass(getIconClass("continent"));

        $("#exampleModal").modal("show");
      },
    });
  } else {
    // console.error('No country selected');
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

countryInfoButton.addTo(map);







function fetchWeatherInfo(countryName) {
  if (countryName) {
    // AJAX call to fetch weather information
    $.ajax({
      url: 'forecast.php',
      method: 'GET',
      data: { countryName: countryName },
      dataType: 'json',
      success: function(result) {
        if (result) {
            var weatherData = result;
            // Update modal with weather data
            $('#weatherModalLabel').text(weatherData.location.name + ', ' + weatherData.location.country);
            $('#todayConditions').text(weatherData.current.condition.text);
            $('#todayIcon').attr('src', 'https:' + weatherData.current.condition.icon);
            $('#todayMaxTemp').text(weatherData.forecast.forecastday[0].day.maxtemp_c + ' °C');
            $('#todayMinTemp').text(weatherData.forecast.forecastday[0].day.mintemp_c + ' °C');
    
            // Check if forecast data is available for the current day
            if (weatherData.forecast.forecastday.length >= 1) {
                // Update day 1 forecast
                $('#day1Date').text(new Date(weatherData.forecast.forecastday[0].date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
                $('#day1Icon').attr('src', 'https:' + weatherData.forecast.forecastday[0].day.condition.icon);
                $('#day1MaxTemp').text(weatherData.forecast.forecastday[0].day.maxtemp_c + ' °C');
                $('#day1MinTemp').text(weatherData.forecast.forecastday[0].day.mintemp_c + ' °C');
            } else {
                console.warn('Insufficient forecast data for the current day');
                // Display a message indicating insufficient forecast data
                $('#day1Date').text('N/A');
                $('#day1Icon').attr('src', '');
                $('#day1MaxTemp').text('N/A');
                $('#day1MinTemp').text('N/A');
            }
    
            $('#lastUpdated').text(new Date(weatherData.current.last_updated).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' }));
            $('#pre-load').addClass('fadeOut');
    
            // Show the weather modal
            $('#weatherModal').modal('show');
        } else {
            console.error('Empty response');
            $('#weatherModal .modal-title').text('Error retrieving data');
        }
    },
    
    
      
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching weather information:', errorThrown);
        $('#weatherModal .modal-title').text('Error retrieving data');
      }
    });
  } else {
    console.error('No country selected');
  }
}

var cityMap = {
  'United Kingdom': 'London',
  // Add more mappings for other countries if needed
};

// Create Leaflet Easy Button for weather
var weatherButton = L.easyButton({
  states: [{
    icon: 'fas fa-cloud',
    title: 'Show Weather Info',
    onClick: function(btn, map) {
      // Get the selected country name from the dropdown
      var selectedOption = $("#countrySelect option:selected");
      var countryName = selectedOption.text();
      // Check if a mapping exists for the selected country
      if (cityMap.hasOwnProperty(countryName)) {
        // Use the mapped city name instead of the country name
        fetchWeatherInfo(cityMap[countryName]);
      } else {
        // Use the country name directly if no mapping is found
        fetchWeatherInfo(countryName);
      }
    }
  }]
});

weatherButton.addTo(map);








function fetchAndDisplayWikipedia(selectedCountryName) {
  // Map the selected country name to its corresponding Wikipedia search query
  var wikipediaSearchQuery = getWikipediaSearchQuery(selectedCountryName);
  
  $.ajax({
    url: 'wikipideaInfo.php',
    method: 'GET',
    data: { q: wikipediaSearchQuery },
    dataType: 'json',
    success: function (result) {
      if (result && result.status && result.status.code === '200' && result.data != null) {
        var wikipediaData = result.data.geonames[1];
        // Update modal content with retrieved Wikipedia data
        $("#wikipediaTitle").text(wikipediaData.title);
        $("#wikipediaSummary").text(wikipediaData.summary);
        // $("#wikipediaElevation").text(wikipediaData.elevation);
        // $("#wikipediaFeature").text(wikipediaData.feature);
        // $("#wikipediaCountryCode").text(wikipediaData.countryCode);
        // $("#wikipediaRank").text(wikipediaData.rank);
        $("#wikipediaThumbnailImg").attr('src', wikipediaData.thumbnailImg);

        var wikipediaLink = "https://" + wikipediaData.wikipediaUrl;
        $("#wikipediaLink").attr('href', wikipediaLink);

        $("#wikipediaModal").modal("show");
      } else {
        // Handle case where no data is found
        $("#wikipediaTitle").text("No Data Found");
        $("#wikipediaSummary").text("No Summary Found");
        $("#wikipediaModal").modal("show");
      }
    },
  });
}

// Function to map selected country name to Wikipedia search query
function getWikipediaSearchQuery(selectedCountryName) {
  // Define mapping of country names to Wikipedia search queries
  var countrySearchQueryMap = {
    "United Kingdom": "london",  // Use full country name for UK
    // Add other country mappings as needed
  };
  
  // Return the corresponding Wikipedia search query
  return countrySearchQueryMap[selectedCountryName] || selectedCountryName;
}

// Leaflet EasyButton for Wikipedia Info in Modal
var wikipediaButton = L.easyButton({
  states: [{
    icon: 'fab fa-wikipedia-w',
    title: 'Show Wikipedia Info',
    onClick: function (btn, map) {
      var selectedCountryName = $("#countrySelect option:selected").text();
      if (selectedCountryName) {
        fetchAndDisplayWikipedia(selectedCountryName);
      } else {
        // Handle case where no country is selected
      }
    }
  }]
});

wikipediaButton.addTo(map);










var exchangeRates;

function calcResult() {
  var fromAmount = $('#fromAmount').val();
  var selectedCurrency = $('#exchangeRate').val();

  // Fetch exchange rate from the API based on the selected currency
  var exchangeRate = exchangeRates[selectedCurrency];

  if (fromAmount && exchangeRate) {
    var convertedAmount = numeral(fromAmount * exchangeRate).format("0,0.00");
    $('#toAmount').val(convertedAmount);
  }
}

function fetchExchangeRates() {
  // Replace the placeholder API key with your actual API key
  // var apiKey = '8222544b5e867a25667eca94eb3bf32b';
  // var apiUrl = 'http://api.exchangeratesapi.io/v1/latest?access_key=' + apiKey;

  $.ajax({
    url: "exchangerates.php",
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      exchangeRates = data.rates;
      populateCurrencyOptions(exchangeRates);
      convertCurrencyAndDisplayResult();
      // Call calcResult() here to update the result when exchange rates are fetched
      calcResult();
    },
  });
}

function populateCurrencyOptions(exchangeRates) {
  var toCurrencySelect = $('#exchangeRate');
  toCurrencySelect.empty();

  $.each(exchangeRates, function (currency, rate) {
    toCurrencySelect.append('<option value="' + currency + '">' + currency + '</option>');
  });
}

function convertCurrencyAndDisplayResult() {
  var fromAmount = $('#fromAmount').val();
  var exchangeRate = $('#exchangeRate').val();

  if (fromAmount && exchangeRate) {
    var convertedAmount = numeral(fromAmount * exchangeRate).format("0,0.00");
    $('#toAmount').val(convertedAmount);
  }
}

// Event listener for when the modal is shown
$('#currencyModal').on('show.bs.modal', function () {
  fetchExchangeRates();
});

// Event listener for changes in the selected currency
$('#exchangeRate').on('change', function () {
  calcResult();
});

// Event listener for changes in the from amount
$('#fromAmount').on('input', function () {
  calcResult();
});

// Leaflet EasyButton Initialization
var currencyConverterButton = L.easyButton({
  states: [
    {
      icon: "fa-coins",
      title: "Open Currency Converter",
      onClick: function (btn, map) {
        $('#currencyModal').modal('show');
      },
    },
  ],
});

currencyConverterButton.addTo(map);  // Replace 'map' with your actual Leaflet map instance









// var selectedVal; 
// var exchangeRates;

// var currencyConverterButton = L.easyButton({
//   states: [
//     {
//       icon: "fa-solid fa-coins",
//       title: "Open Currency Converter",
//       onClick: function (btn, map) {
//         selectedVal = $("#countrySelect").val();
//         fetchDefaultFromCurrency();
//         openCurrencyConverterModal();
//       },
//     },
//   ],
// });

// currencyConverterButton.addTo(map);

// // Your Currency Converter Modal
// function openCurrencyConverterModal() {
//   $('#toCurrency').empty();
//   $('#fromCurrency').empty();

//   fetchDefaultFromCurrency();

//   fetchExchangeRates();
// }

// // Function to fetch the default From Currency for the selected country
// function fetchDefaultFromCurrency() {
//   $.ajax({
//     url: 'currencycode.php',
//     method: 'GET',
//     data: { countryIsoCode: selectedVal },
//     dataType: 'json',
//     success: function (data) {
//       var fromCurrencySelect = $('#fromCurrency');
//       fromCurrencySelect.val(data.isocode);
//     },
//   });
// }

// // Function to fetch exchange rates using AJAX
// function fetchExchangeRates() {
//   $.ajax({
//     url: 'exchangerates.php',
//     method: 'GET',
//     data: { countryIsoCode: selectedVal },
//     dataType: 'json',
//     success: function (data) {
//       exchangeRates = data.rates;
//       populateCurrencyOptions(exchangeRates);
//       $('#converterModal').modal('show');
//     },
//   });
// }
// $(document).on('click', '#close', function () {
//   $('#converterModal').modal('hide');
// });



// // Function to populate "To Currency" options
// function populateCurrencyOptions(exchangeRates) {
//   var toCurrencySelect = $('#toCurrency');
//   var fromCurrencySelect = $('#fromCurrency');
//   $.each(exchangeRates, function (currency, rate) {
//     toCurrencySelect.append('<option value="' + currency + '">' + currency + '</option>');
//     fromCurrencySelect.append('<option value="' + currency + '">' + currency + '</option>');
//   });

//   $('#converterForm').submit(function (e) {
//     e.preventDefault();

//     var amount = $('#amount').val();
//     var fromCurrency = $('#fromCurrency').val();
//     var toCurrency = $('#toCurrency').val();

//     if (amount && fromCurrency && toCurrency) {
//       var convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
//       $('#convertedAmount').text('Converted Amount: ' + convertedAmount.toFixed(2) + ' ' + toCurrency);
//     }
//   });
// }

// // Function to perform currency conversion
// function convertCurrency(amount, fromCurrency, toCurrency) {
//   var rateFrom = exchangeRates[fromCurrency];
//   var rateTo = exchangeRates[toCurrency];

//   if (rateFrom && rateTo) {
//     return (amount / rateFrom) * rateTo;
//   } else {
//     // console.error('Exchange rates for selected currencies not available.');
//     return 0;
//   }
// }


// Function to fetch and display News in the News Modal
function fetchAndDisplayNews(selectedVal) {
  $.ajax({
    url: "newsdata.php", 
    method: 'GET',
    data: { countryIsoCode: selectedVal },
    dataType: 'json',
    success: function (result) {
      $('#newsContent').empty();

      if (result && result.status === 'success' && result.results && result.results.length > 0) {
        var newsArticles = result.results;

        // Iterate through news articles and append them to the modal
        for (var i = 0; i < newsArticles.length; i++) {
          var article = newsArticles[i];
          var newsItem = `<div class="mb-3">
                              <h6>${article.title}</h6>
                              <p>${article.description}</p>
                              <a href="${article.link}" target="_blank">Read more</a>
                          </div>`;
          $('#newsContent').append(newsItem);
        }
        // <img src="${article.image_url}" alt="News Image">
        // Show the News Modal
        $('#newsModal').modal('show');
      } else {
        // Display an error message if there is an issue with the news data
        $('#newsContent').html('<p>No news available or error fetching news data</p>');
        // Show the News Modal with the error message
        $('#newsModal').modal('show');
      }
    },
    error: function (xhr, status, error) {
      // console.error('Error in the AJAX request for news data:', status, error);
      // Display an error message if there is an issue with the AJAX request
      $('#newsContent').html('<p>Error fetching news data</p>');
      // Show the News Modal with the error message
      $('#newsModal').modal('show');
    }
  });
}

// Leaflet EasyButton for News in Modal
var newsModalButton = L.easyButton({
  states: [{
    icon: 'fas fa-newspaper',
    title: 'Show News',
    onClick: function(btn, map) {
      var selectedCountryCode = $("#countrySelect").val();
      fetchAndDisplayNews(selectedCountryCode);
    }
  }]
});

newsModalButton.addTo(map);
