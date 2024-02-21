<?php
// Check if the required parameter is provided
if (isset($_GET['countryIsoCode'])) {
    $countryCode = $_GET['countryIsoCode'];

    // Construct the GeoNames API URL for country information
    $geoNamesUrl = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=it&country={$countryCode}&username=mani0924&style=full";

    // Initialize cURL session for GeoNames API
    $chGeoNames = curl_init();
    curl_setopt($chGeoNames, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($chGeoNames, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chGeoNames, CURLOPT_URL, $geoNamesUrl);

    // Execute cURL session for GeoNames API and get the result
    $resultGeoNames = curl_exec($chGeoNames);

    // Close cURL session for GeoNames API
    curl_close($chGeoNames);

    // Decode the JSON result for GeoNames API
    $decodedResultGeoNames = json_decode($resultGeoNames, true);

    // Check if the GeoNames API request was successful
    if ($decodedResultGeoNames && isset($decodedResultGeoNames['geonames'][0])) {
        $countryName = $decodedResultGeoNames['geonames'][0]['countryName'];

        // Construct the News API URL with the obtained country name
        $newsApiUrl = "https://newsdata.io/api/1/news?apikey=pub_370213e82eb16709acfc8f48e49c855022473&q=government&country={$countryCode}&language=en"; // Replace with your actual API key

        // Reuse cURL handle for News API
        curl_setopt($chGeoNames, CURLOPT_URL, $newsApiUrl);

        // Execute cURL session for News API and get the result
        $resultNewsApi = curl_exec($chGeoNames);

        // Check if the request to News API was successful
        if ($resultNewsApi !== false) {
            // Set the Content-Type header to application/json
            header('Content-Type: application/json');
            // Output the response from the News API
            echo $resultNewsApi;
        } else {
            // Return an error response
            http_response_code(500);
            echo json_encode(array('error' => 'Error fetching news data'));
        }
    } else {
        // Return an error response if the GeoNames API request fails
        http_response_code(500);
        echo json_encode(array('error' => 'Error fetching country information from GeoNames API'));
    }
} else {
    // Return an error response if countryIsoCode is not provided
    http_response_code(400);
    echo json_encode(array('error' => 'Missing required parameter: countryIsoCode'));
}
