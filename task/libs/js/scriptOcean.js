$(document).ready(function() {
    $('#btnRun').click(function() {
        $.ajax({
            url: "libs/php/test.php",
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
                    $('#txtDistance').html(result.data.distance);
                    // $('#Distanceheading').html('distance');
                    $('#txtGeonameId').html(result.data.geonameId);
                    $('#txtName').html(result.data.name);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus, errorThrown);
            }
        });
    });
});
