<?php
// echo '<pre>';
// print_r($_GET['countryName']);
// exit;
// Check if the 'countryName' parameter is set
if (isset($_GET['countryName'])) {
    // Get the country name and API key from the GET parameters
    $countryName = urlencode($_GET['countryName']); // Encode special characters in the country name
    $apiKey = '1b78c5b1539c4bd6b76100413240602'; // Replace 'YOUR_API_KEY' with your actual WeatherAPI.com API key

    // Construct the URL for the WeatherAPI.com request
    $url = "http://api.weatherapi.com/v1/forecast.json?key=$apiKey&q=$countryName&days=1&aqi=no&alerts=no";

    // Fetch weather data from WeatherAPI.com
    $response = file_get_contents($url);

    // Check if the response is valid JSON
    if ($response !== false) {
        // Output the response as it is
        header('Content-Type: application/json');
        echo $response;
    } else {
        // Return an error message if the response is not valid JSON
        http_response_code(500);
        echo json_encode(array('error' => 'Error fetching weather information'));
    }
} else {
    // Return an error message if the 'countryName' parameter is not set
    http_response_code(400);
    echo json_encode(array('error' => 'Missing countryName parameter'));
}
