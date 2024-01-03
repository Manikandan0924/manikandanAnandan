<?php

// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if the country code is set in the request
if (isset($_GET['countryIsoCode'])) {
    $countryCode = $_GET['countryIsoCode'];

    // Construct the GeoNames API URL for country information
    $url = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=it&country={$countryCode}&username=mani0924&style=full";

    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    // Execute cURL session and get the result
    $result = curl_exec($ch);

    // Close cURL session
    curl_close($ch);

    // Decode the JSON result
    $decode = json_decode($result, true);
// echo '<pre>';
// print_r($decode);
// exit;


    // Prepare the output response
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decode;

    // Set the response header
    header('Content-Type: application/json; charset=UTF-8');

    // Output the JSON response
    echo json_encode($output);
}
?>
