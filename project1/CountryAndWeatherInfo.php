<?php
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
$output = array(); // Initialize the $output variable

if (isset($_GET['countryIsoCode'])) {
    $countryCode = $_GET['countryIsoCode'];

    // Get country information
    $countryInfoUrl = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=it&country={$countryCode}&username=mani0924&style=full";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $countryInfoUrl);

    $countryInfoResult = curl_exec($ch);

    curl_close($ch);

    $countryInfo = json_decode($countryInfoResult, true);

    if (isset($countryInfo['geonames'][0])) {
        $north = $countryInfo['geonames'][0]['north'];
        $south = $countryInfo['geonames'][0]['south'];
        $east = $countryInfo['geonames'][0]['east'];
        $west = $countryInfo['geonames'][0]['west'];

        // Get weather information
        $weatherUrl = "http://api.geonames.org/weatherJSON?formatted=true&north={$north}&south={$south}&east={$east}&west={$west}&username=mani0924&style=full";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $weatherUrl);

        $weatherResult = curl_exec($ch);

        curl_close($ch);

        $weatherInfo = json_decode($weatherResult, true);

        // Get weather forecast information
        $forecastUrl = "http://api.example.com/forecastJSON?formatted=true&north={$north}&south={$south}&east={$east}&west={$west}&username=your_username&style=full";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $forecastUrl);

        $forecastResult = curl_exec($ch);

        curl_close($ch);

        $forecastInfo = json_decode($forecastResult, true);

        // Prepare the output response
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data']['countryInfo'] = $countryInfo;
        $output['data']['weatherInfo'] = $weatherInfo;
        $output['data']['weatherForecast'] = $forecastInfo;
    } else {
        // If there's an issue with the country information API, set an error response
        $output['status']['code'] = "404";
        $output['status']['name'] = "not found";
        $output['status']['description'] = "Country information not found";
    }

    // Set the response header
    header('Content-Type: application/json; charset=UTF-8');

    // Output the JSON response
    echo json_encode($output);
}
?>
