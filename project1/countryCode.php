<?php
// Function to update country dropdown based on user's location

if (isset($_GET['latitude']) && isset($_GET['longitude'])) {
    $latitude = $_GET['latitude'];
    $longitude = $_GET['longitude'];

    $username = "mani0924";
    $url = "http://api.geonames.org/countryCodeJSON?formatted=true&lat=$latitude&lng=$longitude&username=$username&style=full";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(array("error" => "Error in cURL request: " . curl_error($ch)));
    } else {
        $data = json_decode($response, true);
        echo json_encode($data);
    }

    curl_close($ch);
} else {
    echo json_encode(array("error" => "Latitude and longitude parameters are required."));
}
?>
