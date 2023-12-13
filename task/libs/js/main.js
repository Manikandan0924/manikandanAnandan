$(document).ready(function () {
    // Ocean API
    $('.btnRunOcean').click(function () {
        $.ajax({
            url: "libs/php/test.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: $('#sellat').val(),
                lng: $('#sellng').val()
            },
            success: function (result) {
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    updateOceanResults(result.data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown);
            }
        });
    });

    // TimeZone API
    $('.btnRunTimeZone').click(function () {
        $.ajax({
            url: "libs/php/test2.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: $('#sellatTime').val(),
                lng: $('#sellngTime').val()
            },
            success: function (result) {
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    updateTimeZoneResults(result.data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown);
            }
        });
    });

    // Weather API
    $('.btnRunWeather').click(function () {
        $.ajax({
            url: "libs/php/test3.php",
            type: 'POST',
            dataType: 'json',
            data: {
                north: $('#northWeather').val(),
                south: $('#southWeather').val(),
                east: $('#eastWeather').val(),
                west: $('#westWeather').val()
            },
            success: function (result) {
                console.log(JSON.stringify(result));
                if (result.status.name == "ok") {
                    updateWeatherResults(result.data[0]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown);
            }
        });
    });

    // Function to update Ocean API results
    function updateOceanResults(data) {
        $('#txtDistance').html(data.distance);
        $('#txtGeonameId').html(data.geonameId);
        $('#txtName').html(data.name);
    }

    // Function to update TimeZone API results
    function updateTimeZoneResults(data) {
        $('#txtcountryName').html(data.countryName);
        $('#txttime').html(data.time);
        $('#txtcountryCode').html(data.countryCode);
    }

    // Function to update Weather API results
    function updateWeatherResults(data) {
        $('#txtTemperature').html(data.temperature);
        $('#txtHumidity').html(data.humidity);
        $('#txtwindDirection').html(data.windDirection);
    }
});
