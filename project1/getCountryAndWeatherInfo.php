<?php
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$output = array(); // Initialize the $output variable

if (isset($_GET['countryIsoCode'])) {
    $countryCode = $_GET['countryIsoCode'];

    // Get country information
    $countryInfoUrl = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country={$countryCode}&username=mani0924&style=full";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $countryInfoUrl);

    $result = curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result, true);
//         echo '<pre>';
// print_r($decode);
// exit;


    if (isset($decode['geonames'][0])) {
        $north = $decode['geonames'][0]['north'];
        $south = $decode['geonames'][0]['south'];
        $east = $decode['geonames'][0]['east'];
        $west = $decode['geonames'][0]['west'];

 
        // Get weather information
        $weatherUrl = "http://api.geonames.org/weatherJSON?formatted=true&north={$north}&south={$south}&east={$east}&west={$west}&username=mani0924&style=full";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $weatherUrl);

        $result = curl_exec($ch);

        curl_close($ch);

        $decode = json_decode($result, true);
        // echo '<pre>';
        // print_r($decode);
        // exit;
        

        // Prepare the output response
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        // $output['data']['decode'] = $decode;
        $output['data'] = $decode;

    } 
    // Set the response header
    header('Content-Type: application/json; charset=UTF-8');

    // Output the JSON response
    echo json_encode($output);
}
?>
