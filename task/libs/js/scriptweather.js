$(document).ready(function() {
    $('#btnRun').click(function() {
        $.ajax({
            url: "libs/php/test3.php",
            type: 'POST',
            dataType: 'json',
            data: {
                north: $('#north').val(),
                south: $('#south').val(),
                east: $('#east').val(),
                west: $('#west').val()
            },
            success: function(result) {
                console.log(JSON.stringify(result));

                console.log(result.data);
                if (result.status.name == "ok") {
                    $('#txtTemperature').html(result['data'][0]['temperature']);
                    $('#txtHumidity').html(result['data'][0]['humidity']);
                    $('#txtwindDirection').html(result['data'][0]['windDirection']);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown);
            }
        });
    });
});


