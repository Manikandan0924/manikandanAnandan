$(document).ready(function() {
    $('#btnRun').click(function() {
        $.ajax({
            url: "libs/php/test2.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: $('#sellat').val(),
                lng: $('#sellng').val()
            },
            success: function(result) {
                console.log(JSON.stringify(result));

                console.log(result.data);
                if (result.status.name == "ok") {
                    $('#txtcountryName').html(result.data.countryName);
                    $('#txttime').html(result.data.time);
                    $('#txtcountryCode').html(result.data.countryCode);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown);
            }
        });
    });
});


